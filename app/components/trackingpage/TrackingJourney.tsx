'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { FiSearch } from 'react-icons/fi';
import { BsBoxSeam, BsAirplane, BsHouseCheck } from 'react-icons/bs';
import { FaPlaneDeparture, FaWarehouse } from 'react-icons/fa';
import type { IconType } from 'react-icons';
import { fetchTrackingData, fetchTrackingByInvoice } from '../../api/trackingApi';
import './TrackingPageStyles.css';

/* ------------------------------- Types ---------------------------------- */
type Mode = 'tracking';

interface Stage {
  key: 'booked' | 'in_transit' | 'arrival' | 'out_for_delivery' | 'delivered';
  title: string;
  alt: string;
  icon: IconType;
}

type TrackResponse = {
  tracking_code?: string;
  tracking_no?: string;
  status_name?: string;
  status?: string;
  status_id?: number;
  method?: string;
  origin?: string;
  origin_port?: string;
  destination?: string;
  destination_port?: string;
  updated_at?: string;

  success?: boolean;
  invoice_no?: string;
  shipment_method?: string;
  [k: string]: unknown;
};

/* ------------------------------ UI Copy --------------------------------- */
const STAGES: Stage[] = [
  { key: 'booked',            title: 'Shipment Booked',        alt: 'Received/Pending',   icon: BsBoxSeam },
  { key: 'in_transit',        title: 'In Transit',             alt: 'Forwarded/Transfer', icon: FaPlaneDeparture },
  { key: 'arrival',           title: 'Arrival & Clearance',    alt: 'Arrived/Clearing',   icon: FaWarehouse  },
  { key: 'out_for_delivery',  title: 'Out for Delivery',       alt: 'Delivery Arranged',  icon: BsAirplane   },
  { key: 'delivered',         title: 'Delivered',              alt: 'Complete',           icon: BsHouseCheck },
];

const placeholders: Record<Mode, string> = {
  tracking: 'Enter tracking number or Invoice Number',
};

const labelCopy: Record<Mode, string> = {
  tracking: 'Track by Tracking Number or Invoice',
};

/* --------------------- Status Display Normalization --------------------- */
const RAW_TO_DISPLAY: Record<string, string> = {
  'shipment received': 'Shipment Booked',
  'shipment booked': 'Shipment Booked',
  'pending': 'Shipment Booked',
  'enquiry collected': 'Shipment Booked',
  'shipment forwarded': 'In Transit',
  'transfer': 'In Transit',
  'more tracking': 'In Transit',
  'shipment arrived': 'Arrival & Clearance',
  'waiting for clearance': 'Arrival & Clearance',
  'shipment on hold': 'Arrival & Clearance',
  'shipment cleared': 'Arrival & Clearance',
  'delivery arranged': 'Out for Delivery',
  'shipment out for delivery': 'Out for Delivery',
  'not delivered': 'Out for Delivery',
  'delivered': 'Delivered',
};

/* ----------------------- Status → Stage Mapping ------------------------- */
const STATUS_ID_TO_STAGE: Record<number, number> = {
  1: 0, // Shipment received
  2: 0, // Shipment booked
  11: 0, // Pending
  13: 0, // Enquiry collected
  3: 1,  // Shipment forwarded
  12: 1, // More Tracking
  14: 1, // Transfer
  4: 2,  // Shipment arrived
  5: 2,  // Waiting for clearance
  6: 2,  // Shipment on hold
  7: 2,  // Shipment cleared
  8: 3,  // Delivery arranged
  9: 3,  // Shipment out for delivery
  10: 3, // Not Delivered
  15: 4, // DELIVERED
};


const STATUS_NAME_TO_STAGE: Record<string, number> = {
  'shipment received': 0, 'shipment booked': 0, 'pending': 0, 'enquiry collected': 0,
  'shipment forwarded': 1, 'more tracking': 1, 'transfer': 1,
  'shipment arrived': 2, 'waiting for clearance': 2, 'shipment on hold': 2, 'shipment cleared': 2,
  'delivery arranged': 3, 'shipment out for delivery': 3, 'not delivered': 3,
  'delivered': 4,
};

const EXCEPTION_NAMES = new Set(['shipment on hold', 'not delivered']);

function normalizeKey(s: string): string {
  return (s || '').trim().replace(/\s+/g, ' ').toLowerCase();
}

function getString(o: unknown, keys: readonly string[]): string {
  if (o && typeof o === 'object') {
    const dict = o as Record<string, unknown>;
    for (const k of keys) {
      const v = dict[k];
      if (typeof v === 'string') return v;
    }
  }
  return '';
}

function getNumberish(o: unknown, keys: readonly string[]): number | null {
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
}

function resolveStatus(payload?: TrackResponse): { stageIndex: number; displayLabel: string; raw: string } {

  if (!payload) return { stageIndex: -1, displayLabel: '', raw: '' };

  const id = getNumberish(payload, ['status_id', 'statusId', 'status_code', 'statusID', 'status']);
  const textLabel = getString(payload, ['status_name', 'status', 'status_label', 'current_status', 'name']);

  if (id !== null && STATUS_ID_TO_STAGE[id] !== undefined) {
    const stageIndex = STATUS_ID_TO_STAGE[id];
    const displayFallback = STAGES[stageIndex]?.title ?? 'Shipment Booked';
    const display = textLabel ? normalizeStatusLabel(textLabel, stageIndex) : displayFallback;
    return { stageIndex, displayLabel: display, raw: String(id) };
  }

  if (textLabel) {
    const stageIndex = deriveStageFromLabel(textLabel);
    return { stageIndex, displayLabel: normalizeStatusLabel(textLabel, stageIndex), raw: textLabel };
  }

  // If nothing matched, default to booked
  return { stageIndex: 0, displayLabel: 'Shipment Booked', raw: '' };
}

function deriveStageFromLabel(detail: string): number {
  const key = normalizeKey(detail);
  if (EXCEPTION_NAMES.has(key)) return 2;

  if (RAW_TO_DISPLAY[key] !== undefined) {
    const label = RAW_TO_DISPLAY[key];
    const idx = STAGES.findIndex(s => s.title === label);
    if (idx >= 0) return idx;
  }

  if (/deliver/i.test(key)) return /not/.test(key) ? 3 : 4;
  if (/out/.test(key)) return 3;
  if (/arriv|dest|clear/.test(key)) return 2;
  if (/transit|forward|transfer/.test(key)) return 1;
  if (/book|receiv|enquiry|pending/.test(key)) return 0;

  return 0;
}


function normalizeStatusLabel(detail: string, stageIndex: number): string {
  const key = normalizeKey(detail);
  if (RAW_TO_DISPLAY[key]) return RAW_TO_DISPLAY[key];

  if (/forward|transfer|transit/i.test(key)) return 'In Transit';
  if (/arriv|clear/i.test(key)) return 'Arrival & Clearance';
  if (/out.*deliver/i.test(key)) return 'Out for Delivery';
  if (/deliver/i.test(key)) return 'Delivered';
  if (/book|receiv|enquiry|pending/i.test(key)) return 'Shipment Booked';

  if (stageIndex >= 0 && stageIndex < STAGES.length) return STAGES[stageIndex].title;
  return detail || 'Shipment Booked';
}

function deriveStageFromApi(payload?: TrackResponse) {
  const detail = (payload?.status_name || payload?.status || '').trim();
  let exception = false;

  if (typeof payload?.status_id === 'number') {
    const idx = STATUS_ID_TO_STAGE[payload.status_id];
    if (idx !== undefined) {
      if (detail && EXCEPTION_NAMES.has(detail.toLowerCase())) exception = true;
      return { index: idx, exception, detail };
    }
  }

  const key = detail.toLowerCase();
  if (STATUS_NAME_TO_STAGE[key] !== undefined) {
    if (EXCEPTION_NAMES.has(key)) exception = true;
    return { index: STATUS_NAME_TO_STAGE[key], exception, detail };
  }

  if (/deliver/i.test(detail)) return { index: /not/i.test(detail) ? 3 : 4, exception, detail };
  if (/out/i.test(detail)) return { index: 3, exception, detail };
  if (/arriv|dest|clear/i.test(detail)) return { index: 2, exception, detail };
  if (/transit|forward|transfer/i.test(detail)) return { index: 1, exception, detail };
  if (/book|receiv|enquiry|pending/i.test(detail)) return { index: 0, exception, detail };

  return { index: 0, exception, detail };
}

/* --------------------------- Helpers (UPDATED) --------------------------- */
// Accept numeric only strings
const isNumericOnly = (v: string) => /^\d+$/.test(v.trim());

// Accept letter prefix + hyphen, then one or more groups of letters/digits/hyphens
// Examples: "A-12345", "KSA-2025-001"
const isLetterHyphenInvoice = (v: string) => /^[A-Za-z]+-[A-Za-z0-9-]+$/.test(v.trim());

// Keep legacy INV patterns like "INV-2025-3109" or "INV/2025-3109"
const isInvPattern = (v: string) => /^INV[-/][A-Za-z0-9-]+$/i.test(v.trim());

// Accept alphanumeric strings like "E91", "R0092", "RD123456"
const isAlphaNumeric = (v: string) => /^[A-Za-z]+[0-9]+[A-Za-z0-9]*$/.test(v.trim());

const isInvoiceQuery = (v: string) => {
  const s = v.trim();
  return isNumericOnly(s) || isLetterHyphenInvoice(s) || isInvPattern(s) || isAlphaNumeric(s);
};

const fetchSmart = async (q: string) => {
  const s = q.trim();
  if (isInvoiceQuery(s)) {
    return fetchTrackingByInvoice(s);
  }
  return fetchTrackingData(s);
};

/* ------------------------- Public Component API ------------------------- */
type TrackingJourneyProps = {
  initialQuery?: string;
  autoFetch?: boolean;
};

const TrackingJourney: React.FC<TrackingJourneyProps> = ({ initialQuery, autoFetch }) => {
  const [mode] = useState<Mode>('tracking');
  const [q, setQ] = useState(initialQuery ?? '');
  const [touched, setTouched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<TrackResponse | null>(null);
  const [err, setErr] = useState<string | null>(null);

  // VALIDATION: allow 3+ chars (to permit 3-digit invoices), limited charset
  const valid = useMemo(() => {
    if (!touched && q === '') return false;
    return /^[A-Za-z0-9\-/:]{3,}$/i.test(q.trim());
  }, [q, touched]);

const { stageIndex: currentIndex, displayLabel: displayStatus } = useMemo(
  () => resolveStatus(data || undefined),
  [data]
);

  useEffect(() => {
    if (!initialQuery || !autoFetch) return;
    setTouched(true);
    (async () => {
      setErr(null);
      setData(null);
      setLoading(true);
      try {
        const json = await fetchSmart(initialQuery.trim());
        setData(json);
      } catch (e: unknown) {
        setErr('Tracking number not found. Please check the number and try again.');
      } finally {
        setLoading(false);
      }
    })();
  }, [initialQuery, autoFetch]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    if (!valid) return;

    setErr(null);
    setData(null);
    setLoading(true);

    try {
      const json = await fetchSmart(q.trim());
      setData(json);
    } catch (e: unknown) {
      setErr('Tracking number not found. Please check the number and try again.');
    } finally {
      setLoading(false);
    }
  };

  const isInvoice = isInvoiceQuery(q) || !!data?.invoice_no;
  const displayCode = data?.invoice_no || data?.tracking_code || data?.tracking_no || q.trim();
  const method = data?.shipment_method || data?.method;

  // const rawStatus = (data?.status_name || data?.status || '').trim();
  // const displayStatus = normalizeStatusLabel(rawStatus, currentIndex);

  return (
    <section className="tracking-journey-section bg-transparent text-black">
      <div className="max-w-5xl mx-auto px-0 py-0">
        <div className="w-full rounded-2xl border border-neutral-200 bg-white">
          {/* Header */}
          <div className="flex flex-col gap-3 border-b border-neutral-200 p-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="track-form-heading text-xl tracking-tight sm:text-2xl">Track Your Shipment</h1>
              <p className="track-form-sub-heading mt-1 text-xs sm:text-sm text-black">
                Real-time milestone view from booking to delivery.
              </p>
            </div>
            <div className="track-form-status-head flex items-center gap-2 text-xs text-black">
              <div className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" /> Live status
            </div>
          </div>

          {/* Form */}
          <form onSubmit={onSubmit} className="grid gap-4 p-4">
            <div className="flex flex-col gap-3 sm:flex-row">
              <label className="sr-only" htmlFor="track-input">{labelCopy[mode]}</label>
              <input
                id="track-input"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                onBlur={() => setTouched(true)}
                placeholder={placeholders[mode]}
                inputMode="text"
                className="w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 text-base outline-none transition placeholder:text-neutral-500 focus:border-neutral-400 focus:bg-white focus:shadow-[0_0_0_3px_rgba(59,130,246,0.25)]"
              />
              <button type="submit" className="track-form-btn inline-flex items-center gap-2 rounded-xl bg-black text-white px-4 py-3 disabled:opacity-60" disabled={loading}>
                <FiSearch size={16} className="shrink-0" />
                {loading ? ' Checking…' : ' Track'}
              </button>
            </div>

            {touched && !valid && (
              <p className="text-sm text-red-500 track-form-validation">
                Enter a valid tracking number or invoice (3+ chars).
              </p>
            )}
            {loading && <p className="text-sm text-neutral-600">Checking status…</p>}
            {err && <p className="text-sm text-red-600">{err}</p>}

            {/* Identifiers */}
            {data && (
              <div className="rounded-xl border border-neutral-200 bg-white p-4 text-sm">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2 py-1 rounded bg-yellow-100 text-yellow-900 font-semibold">
                    {displayCode}
                  </span>
                  {isInvoice && (
                    <span className="px-2 py-1 rounded bg-indigo-100 text-indigo-900">Invoice/Bill</span>
                  )}
                  {method && (
                    <span className="px-2 py-1 rounded bg-emerald-100 text-emerald-900">{method}</span>
                  )}
                  {displayStatus && (
                    <span className="px-2 py-1 rounded bg-neutral-100 text-neutral-900">{displayStatus}</span>
                  )}
                  <button
                    type="button"
                    className="text-xs px-2 py-1 rounded border bg-gray-50 hover:bg-gray-100"
                    onClick={() => { if (displayCode) navigator.clipboard.writeText(String(displayCode)); }}
                  >
                    Copy
                  </button>
                </div>
              </div>
            )}

            {/* Stages */}
            <div className="mt-1 rounded-2xl border border-neutral-200 bg-neutral-50 p-5">
              <ol className="relative mx-auto sm:flex sm:flex-col sm:w-full lg:grid lg:grid-cols-5 gap-0">
                {STAGES.map((s, i) => {
                  const Icon = s.icon;
                  const reached = i <= currentIndex && currentIndex >= 0;
                  const isCurrent = i === currentIndex && currentIndex >= 0;

                  return (
                    <li key={s.key} className="track-list-flex relative flex sm:flex-col items-center text-center sm:w-full lg:w-auto">
                      {i !== 0 && (
                        <div
                          className={[
                            'absolute left-0 right-0 top-4 h-1',
                            i <= currentIndex && currentIndex >= 0 ? 'progressBarActive' : 'progressBar',
                          ].join(' ')}
                        />
                      )}
                      <div className="relative z-10 flex h-8 w-8 items-center justify-center">
                        <div className={['absolute inset-0 rounded-full', reached ? 'nodeGlow' : 'bg-neutral-200'].join(' ')} />
                        <Icon size={20} className={reached ? 'text-black' : 'text-neutral-400'} />
                      </div>
                      <div className="track-title-description text-xs font-medium text-black">
                        <h2 className="track-form-data-heading">{s.title}</h2>
                        <p className="track-form-data-sub-heading">{s.alt}</p>
                      </div>
                      {isCurrent && (
                        <div className={`mt-2 rounded-full px-3 py-1 text-[10px] font-semibold ${i === STAGES.length - 1 ? 'bg-green-500/10 text-green-600' : 'bg-emerald-500/10 text-emerald-600'}`}>
                          {i === STAGES.length - 1 ? 'Completed' : 'In progress'}
                        </div>
                      )}
                    </li>
                  );
                })}
              </ol>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default TrackingJourney;
