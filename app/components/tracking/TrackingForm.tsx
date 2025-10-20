'use client';

import React, { useMemo, useState } from 'react';
import { FiSearch } from 'react-icons/fi';
import { MdOutlineLocationOn } from 'react-icons/md';
import { fetchTrackingData, fetchTrackingByInvoice } from '@/app/api/trackingApi';
import TrackingModal, { TrackingModalShipment } from './TrackingModal';

/* ------------------------------- Types ---------------------------------- */
type Mode = 'tracking';
type ActiveTab = 'tracking' | 'invoice';

export type TrackResponse = {
  tracking_code?: string;
  tracking_no?: string;
  status_name?: string;                  // text label ("Enquiry collected")
  status?: string | number;              // "8" (physical) or "Enquiry collected"
  status_id?: number | string;
  method?: string;
  origin?: string;
  origin_port?: string;
  destination?: string;
  destination_port?: string;
  updated_at?: string;

  success?: boolean;
  invoice_no?: string;
  shipment_method?: string;
};

/* ------------------------------ UI Copy --------------------------------- */
const placeholders: Record<Mode, string> = {
  tracking: 'Enter tracking number or Invoice Number',
};
const labelCopy: Record<Mode, string> = {
  tracking: 'Track by Tracking Number or Invoice',
};

/* ----------------------- Timeline definitions --------------------------- */
const STAGE_TITLES = [
  'Shipment Booked',
  'In Transit',
  'Arrival & Clearance',
  'Out for Delivery',
  'Delivered',
] as const;

/* ----------------------- Status → Stage Mapping ------------------------- */
const STATUS_ID_TO_STAGE: Record<number, number> = {
  1: 0, 2: 0, 11: 0, 13: 0,
  3: 1, 12: 1, 14: 1,
  4: 2, 5: 2, 6: 2, 7: 2,
  8: 3, 9: 3, 10: 3,
};

const RAW_TO_DISPLAY: Record<string, string> = {
  // Booked / Pending
  'shipment received': 'Shipment Booked',
  'shipment booked': 'Shipment Booked',
  'pending': 'Shipment Booked',
  'enquiry collected': 'Shipment Booked',

  // In-Transit
  'shipment forwarded': 'In Transit',
  'more tracking': 'In Transit',
  'transfer': 'In Transit',

  // Arrival & Clearance
  'shipment arrived': 'Arrival & Clearance',
  'waiting for clearance': 'Arrival & Clearance',
  'shipment on hold': 'Arrival & Clearance',
  'shipment cleared': 'Arrival & Clearance',

  // Out for Delivery
  'delivery arranged': 'Out for Delivery',
  'shipment out for delivery': 'Out for Delivery',
  'not delivered': 'Out for Delivery',

  // Done
  'delivered': 'Delivered',
};

const normalizeKey = (s: string): string =>
  (s || '').trim().replace(/\s+/g, ' ').toLowerCase();

/* --------------------------- Input helpers ------------------------------ */
// 3, 6, or 9 digits
const is3or6or9Digits = (v: string) => /^(\d{3}|\d{6}|\d{9})$/.test(v.trim());

// Letter prefix + hyphen + rest: "A-12345", "KSA-2025-001"
const isLetterHyphenInvoice = (v: string) => /^[A-Za-z]+-[A-Za-z0-9-]+$/.test(v.trim());

// Invoice patterns: "INV-2025-3109", "INV/2025-3109"
const isInvoicePattern = (v: string) => /^INV[-/][A-Za-z0-9-]+$/i.test(v.trim());

// Any value that should go to /tracks
const isInvoiceQuery = (v: string) =>
  is3or6or9Digits(v) || isLetterHyphenInvoice(v) || isInvoicePattern(v);

// Allow 3+ chars
const isValidCodeInput = (v: string) => /^[A-Za-z0-9\-/:]{3,}$/i.test(v.trim());

/* ---------------------- Status normalization utils ---------------------- */
const getNumberish = (o: unknown, keys: readonly string[]): number | null => {
  if (o && typeof o === 'object') {
    const dict = o as Record<string, unknown>;
    for (const k of keys) {
      const v = dict[k];
      if (typeof v === 'number' && Number.isFinite(v)) return v;
      if (typeof v === 'string') {
        const n = Number(v);
        if (!Number.isNaN(n)) return n;
      }
    }
  }
  return null;
};

const getString = (o: unknown, keys: readonly string[]): string => {
  if (o && typeof o === 'object') {
    const dict = o as Record<string, unknown>;
    for (const k of keys) {
      const v = dict[k];
      if (typeof v === 'string') return v;
    }
  }
  return '';
};

const deriveStageFromLabel = (detail: string): number => {
  const key = normalizeKey(detail);

  if (RAW_TO_DISPLAY[key] !== undefined) {
    const label = RAW_TO_DISPLAY[key];
    const idx = STAGE_TITLES.findIndex((t) => t === label);
    if (idx >= 0) return idx;
  }

  if (/deliver/i.test(key)) return /not/.test(key) ? 3 : 4;
  if (/out/.test(key)) return 3;
  if (/arriv|dest|clear/.test(key)) return 2;
  if (/transit|forward|transfer/.test(key)) return 1;
  if (/book|receiv|enquiry|pending/.test(key)) return 0;
  return -1;
};

const normalizeStatusLabel = (detail: string, stageIndex: number): string => {
  const key = normalizeKey(detail);
  if (RAW_TO_DISPLAY[key]) return RAW_TO_DISPLAY[key];
  if (/forward|transfer|transit/i.test(key)) return 'In Transit';
  if (/arriv|clear/i.test(key)) return 'Arrival & Clearance';
  if (/out.*deliver/i.test(key)) return 'Out for Delivery';
  if (/deliver/i.test(key)) return 'Delivered';
  if (/book|receiv|enquiry|pending/i.test(key)) return 'Shipment Booked';
  return STAGE_TITLES[stageIndex] ?? (detail || '');
};

/** Accepts both shapes:
 *  - physical bill: { status: "8", invoice_no: "202002", shipment_method: "INDO SEA" }
 *  - cargo track:   { status: "Enquiry collected", tracking_code: "...", ... }
 */
const resolveStatus = (payload?: TrackResponse): { stageIndex: number; displayLabel: string } => {
  if (!payload) return { stageIndex: -1, displayLabel: '' };

  const id = getNumberish(payload, ['status_id', 'statusId', 'status_code', 'statusID', 'status']);
  const textLabel = getString(payload, ['status_name', 'status', 'status_label', 'current_status', 'name']);

  if (id !== null && STATUS_ID_TO_STAGE[id] !== undefined) {
    const stageIndex = STATUS_ID_TO_STAGE[id];
    const display = textLabel ? normalizeStatusLabel(textLabel, stageIndex) : STAGE_TITLES[stageIndex];
    return { stageIndex, displayLabel: display };
  }

  if (textLabel) {
    const stageIndex = deriveStageFromLabel(textLabel);
    return { stageIndex, displayLabel: normalizeStatusLabel(textLabel, stageIndex) };
  }

  return { stageIndex: -1, displayLabel: '' };
};

/* --------------------------------- UI ----------------------------------- */
const TrackingForm: React.FC = () => {
  const [mode] = useState<Mode>('tracking');

  // Tabs & input states
  const [activeTab, setActiveTab] = useState<ActiveTab>('tracking');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [invoiceNumber, setInvoiceNumber] = useState('');

  // UX states
  const [touched, setTouched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Modal / data
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [shipment, setShipment] = useState<TrackingModalShipment | null>(null);

  // Validate current tab value
  const currentValue = activeTab === 'invoice' ? invoiceNumber : trackingNumber;
  const valid = useMemo(() => {
    if (!touched && currentValue.length === 0) return false;
    // Invoice tab uses invoice rules; tracking tab uses generic 3+ chars
    return activeTab === 'invoice'
      ? isInvoiceQuery(currentValue) // strict invoice patterns incl. 3/6/9 digits
      : isValidCodeInput(currentValue);
  }, [activeTab, currentValue, touched]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    if (!valid) return;

    setErrorMsg(null);
    setLoading(true);

    try {
      const query = currentValue.trim();
      const useInvoiceEndpoint =
        activeTab === 'invoice' || isInvoiceQuery(query);

      const data: TrackResponse = useInvoiceEndpoint
        ? await fetchTrackingByInvoice(query)
        : await fetchTrackingData(query);

      const displayCode =
        data?.invoice_no || data?.tracking_code || data?.tracking_no || query;

      const method = data?.shipment_method || data?.method;

      const { stageIndex, displayLabel } = resolveStatus(data);

      const mapped: TrackingModalShipment = {
        trackingCode: displayCode,
        method,
        statusName: data?.status_name || (typeof data?.status === 'string' ? data.status : undefined),
        statusId:
          typeof data?.status_id === 'number'
            ? data.status_id
            : typeof data?.status_id === 'string' && !Number.isNaN(Number(data.status_id))
            ? Number(data.status_id)
            : typeof data?.status === 'string' && !Number.isNaN(Number(data.status))
            ? Number(data.status)
            : undefined,
        status: typeof data?.status === 'string' ? data.status : undefined,
        origin: data?.origin,
        originPort: data?.origin_port,
        destination: data?.destination,
        destinationPort: data?.destination_port,
        updatedAt: data?.updated_at,
        exceptionNote: undefined,
        currentIndex: stageIndex,              // -1..4 (neutral when -1)
        displayStatus: displayLabel || undefined,
      };

      setShipment(mapped);
      setIsModalOpen(true);
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : typeof err === 'string' ? err : 'Failed to fetch';
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="tracking-form-box w-full max-w-md bg-white shadow-lg p-8 mx-auto relative rounded-2xl">
        <h2 className="mb-4 tracking-form-heading text-xl font-semibold">Track Order Form</h2>

        {/* Tabs */}
        <div className="mb-6 flex rounded-xl overflow-hidden border border-neutral-200">
          <button
            type="button"
            className={`flex-1 px-4 py-2 text-sm ${activeTab === 'tracking' ? 'bg-black text-white' : 'bg-white text-black'}`}
            onClick={() => { setActiveTab('tracking'); setTouched(false); }}
          >
            Tracking No.
          </button>
          <button
            type="button"
            className={`flex-1 px-4 py-2 text-sm ${activeTab === 'invoice' ? 'bg-black text-white' : 'bg-white text-black'}`}
            onClick={() => { setActiveTab('invoice'); setTouched(false); }}
          >
            Invoice / Bill
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {activeTab === 'invoice' ? (
            <input
              type="text"
              placeholder="Invoice Number (INV-xxxx / INV/xxxx) or 3/6/9-digit bill no."
              className="tracking-input mb-6 block w-full bg-gray-100 rounded-xl px-5 py-3 text-lg text-gray-800 outline-none"
              value={invoiceNumber}
              onChange={(e) => setInvoiceNumber(e.target.value)}
              onBlur={() => setTouched(true)}
            />
          ) : (
            <input
              type="text"
              placeholder="Tracking Number (e.g., RD:200005, RUH81-5)"
              className="tracking-input mb-6 block w-full bg-gray-100 rounded-xl px-5 py-3 text-lg text-gray-800 outline-none"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              onBlur={() => setTouched(true)}
            />
          )}

          {touched && !valid && (
            <div className="mb-4 text-sm text-red-600">
              {activeTab === 'invoice'
                ? <>Enter a valid invoice (3/6/9 digits, <code>INV-</code>/<code>INV/</code>, or <code>LETTERS-XXXX</code>).</>
                : <>Enter a valid tracking code (min 3 chars). Allowed: letters, numbers, <code>-</code>, <code>/</code>, <code>:</code>.</>}
            </div>
          )}

          <button
            type="submit"
            className="tracking-submit-btn w-full bg-black text-white rounded-xl py-3 text-base font-semibold disabled:opacity-60"
            disabled={loading}
          >
            <span className="inline-flex items-center gap-2">
              <FiSearch size={16} />
              {loading ? ' Checking…' : ' Track Now'}
            </span>
          </button>

          {errorMsg && (
            <div className="mt-4 text-sm text-red-600">{errorMsg}</div>
          )}
        </form>

        {/* Footer hint */}
        <div className="mt-6 flex items-center gap-2 text-xs text-neutral-600">
          <MdOutlineLocationOn size={16} />
          Live milestone view from booking to delivery
        </div>
      </div>

      {/* Modal */}
      <TrackingModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        shipment={shipment}
      />
    </>
  );
};

export default TrackingForm;
