'use client';

import React, { useState } from 'react';
import { MdOutlineLocationOn } from 'react-icons/md';
import './TrackfromStyles.css';
import TrackingModal, { TrackingModalShipment } from './TrackingModal';
import { fetchTrackingData, fetchTrackingByInvoice } from '../../api/trackingApi';

/** Helpers: endpoint routing ********************************************************/

// Pure 6-digit bill/invoice number (e.g., "123456") → /tracks
const isSixDigitBillNo = (v: string) => /^\d{6}$/.test(v.trim());

// Invoice patterns: "INV-2025-3109", "INV/2025-3109" → /tracks
const isInvoicePattern = (v: string) => /^INV[-/][A-Za-z0-9-]+$/i.test(v.trim());

// Any value that should go to the /tracks endpoint
const isInvoiceQuery = (v: string) => isSixDigitBillNo(v) || isInvoicePattern(v);

// Accept tracking codes like "RD:200005", "RUH81-5" (and general alnum with - / :)
const isValidCodeInput = (v: string) => /^[A-Za-z0-9\-/:]{6,}$/i.test(v.trim());

/** Map API status → stage index (0..4) *********************************************/
const STATUS_ID_TO_STAGE: Record<number, number> = {
  1: 0, 2: 0, 11: 0, 13: 0,
  3: 1, 12: 1, 14: 1,
  4: 2, 5: 2, 6: 2, 7: 2,
  8: 3, 9: 3, 10: 3,
};

const STATUS_NAME_TO_STAGE: Record<string, number> = {
  'shipment received': 0, 'shipment booked': 0, 'pending': 0, 'enquiry collected': 0,
  'shipment forwarded': 1, 'more tracking': 1, 'transfer': 1,
  'shipment arrived': 2, 'waiting for clearance': 2, 'shipment on hold': 2, 'shipment cleared': 2,
  'delivery arranged': 3, 'shipment out for delivery': 3, 'not delivered': 3,
  'delivered': 4,
};

function mapStatusToIndex(statusName?: string, statusId?: number): number {
  const name = (statusName || '').trim().toLowerCase();
  if (typeof statusId === 'number' && STATUS_ID_TO_STAGE[statusId] !== undefined) {
    return STATUS_ID_TO_STAGE[statusId];
  }
  if (name && STATUS_NAME_TO_STAGE[name] !== undefined) {
    return STATUS_NAME_TO_STAGE[name];
  }
  if (/deliver/i.test(name)) return /not/i.test(name) ? 3 : 4;
  if (/out/i.test(name)) return 3;
  if (/arriv|dest|clear/i.test(name)) return 2;
  if (/transit|forward|transfer/i.test(name)) return 1;
  if (/book|receiv|enquiry|pending/i.test(name)) return 0;
  return 0; // default to first stage
}

/** Component ****************************************************************************/

type Tab = 'invoice' | 'tracking';

const TrackingForm: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('tracking');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [valid, setValid] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);
  const [shipment, setShipment] = useState<TrackingModalShipment | undefined>(undefined);

  const openWith = async (val: string) => {
    if (!val || !isValidCodeInput(val)) {
      setValid(false);
      return;
    }
    setValid(true);

    const code = val.trim();

    // Prep modal
    setShipment(undefined);
    setError(undefined);
    setIsModalOpen(true);
    setLoading(true);

    try {
      // Route to the right endpoint
      const data = isInvoiceQuery(code)
        ? await fetchTrackingByInvoice(code)      // /tracks/{invoiceNo or 6-digit}
        : await fetchTrackingData(code);          // /track/{trackingCode}

      const trackingCode =
        data?.tracking_code || data?.tracking_no || data?.trackingNo || data?.invoice_no || code;

      const statusName = data?.status_name || data?.status || '';
      const statusId   = typeof data?.status_id === 'number' ? data?.status_id : undefined;

      const mapped: TrackingModalShipment = {
        trackingCode,
        method: data?.method || data?.shipment_method || data?.mode || undefined,
        statusName: statusName || undefined,
        statusId,
        status: data?.status || undefined,
        origin: data?.origin || undefined,
        originPort: data?.origin_port || undefined,
        destination: data?.destination || undefined,
        destinationPort: data?.destination_port || undefined,
        updatedAt: data?.updated_at || undefined,
        exceptionNote: data?.exception || data?.hold_reason || undefined,
        currentIndex: mapStatusToIndex(statusName, statusId),
      };

      setShipment(mapped);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : typeof e === 'string' ? e : JSON.stringify(e);
      setError(msg || 'Failed to fetch');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const value = activeTab === 'tracking' ? trackingNumber : invoiceNumber;
    openWith(value);
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
            onClick={() => setActiveTab('tracking')}
          >
            Tracking No.
          </button>
          <button
            type="button"
            className={`flex-1 px-4 py-2 text-sm ${activeTab === 'invoice' ? 'bg-black text-white' : 'bg-white text-black'}`}
            onClick={() => setActiveTab('invoice')}
          >
            Invoice / Bill
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {activeTab === 'invoice' ? (
            <input
              type="text"
              placeholder="Invoice Number (INV-xxxx-xxxx) or 6-digit bill no."
              className="tracking-input mb-6 block w-full bg-gray-100 rounded-xl px-5 py-3 text-lg text-gray-800 outline-none"
              value={invoiceNumber}
              onChange={(e) => setInvoiceNumber(e.target.value)}
            />
          ) : (
            <input
              type="text"
              placeholder="Tracking Number (e.g., RD:200005, RUH81-5)"
              className="tracking-input mb-6 block w-full bg-gray-100 rounded-xl px-5 py-3 text-lg text-gray-800 outline-none"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
            />
          )}

          {!valid && (
            <div className="mb-4 text-sm text-red-600">
              Enter a valid code (min 6 chars). Allowed: letters, numbers, <code>-</code>, <code>/</code>, <code>:</code>
            </div>
          )}

          <button
            type="submit"
            className="tracking-submit-btn w-full bg-black text-white rounded-xl py-3 text-base font-semibold disabled:opacity-60"
          >
            Track Now
          </button>
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
        loading={loading}
        error={error}
        shipment={shipment}
      />
    </>
  );
};

export default TrackingForm;
