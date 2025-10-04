'use client';

import React, { useEffect, useState } from 'react';
import { MdOutlineLocationOn } from 'react-icons/md';
import './TrackfromStyles.css';
import TrackingModal, { TrackingModalShipment } from './TrackingModal';
import { fetchTrackingData } from '../../api/trackingApi';

type Tab = 'invoice' | 'tracking';

const statusKeyOrder = ['booked','in_transit','arrival','out_for_delivery','delivered'] as const;
type StageKey = typeof statusKeyOrder[number];

function norm(s?: string) {
  return (s || '').toString().trim().toLowerCase().replace(/\s+/g, '_');
}

function mapStatusToIndex(statusName?: string, statusId?: number): number {
  const n = norm(statusName);
  // Common aliases
  const alias: Record<string, StageKey> = {
    received: 'booked',
    pending: 'booked',
    forwarded: 'in_transit',
    transfer: 'in_transit',
    arrived: 'arrival',
    clearing: 'arrival',
    customs: 'arrival',
    'out_for_delivery': 'out_for_delivery',
    delivered: 'delivered',
    complete: 'delivered',
  };

  if (n && alias[n]) return statusKeyOrder.indexOf(alias[n]);
  if (n && statusKeyOrder.includes(n as StageKey)) {
    return statusKeyOrder.indexOf(n as StageKey);
  }

  // Fallback by id if your API uses ascending stage ids
  if (typeof statusId === 'number') {
    // Clamp 0..4
    return Math.max(0, Math.min(4, statusId));
  }
  return -1; // unknown → show neutral UI
}

const TrackingForm: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('tracking');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [valid, setValid] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [seedQuery, setSeedQuery] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [shipment, setShipment] = useState<TrackingModalShipment | undefined>(undefined);
  const [error, setError] = useState<string | undefined>(undefined);

  // keep body lock (redundant with modal but harmless)
  useEffect(() => {
    document.body.style.overflow = isModalOpen ? 'hidden' : '';
  }, [isModalOpen]);

  const openWith = async (val: string) => {
    if (!val || val.trim().length < 6) {
      setValid(false);
      return;
    }
    setValid(true);
    const code = val.trim();

    // Open modal in skeleton state
    setShipment(undefined);
    setError(undefined);
    setSeedQuery(code);
    setIsModalOpen(true);
    setLoading(true);

    try {
      const data = await fetchTrackingData(code);
      // Expecting fields (any subset): tracking_code/tracking_no, status_name/status, status_id,
      // method, origin, origin_port, destination, destination_port, updated_at, exception
      const trackingCode =
        data?.tracking_code || data?.tracking_no || data?.trackingNo || code;

      const statusName = data?.status_name || data?.status || '';
      const statusId   = typeof data?.status_id === 'number' ? data?.status_id : undefined;

      const mapped: TrackingModalShipment = {
        trackingCode,
        method: data?.method || data?.shipment_method || data?.mode || undefined,
        statusName: statusName || undefined,
        statusId,
        origin: data?.origin || undefined,
        originPort: data?.origin_port || undefined,
        destination: data?.destination || undefined,
        destinationPort: data?.destination_port || undefined,
        updatedAt: data?.updated_at || data?.updatedAt || undefined,
        exceptionNote: data?.exception || data?.hold_reason || undefined,
        currentIndex: mapStatusToIndex(statusName, statusId),
      };

      setShipment(mapped);
    } catch (e: any) {
      setError(e?.message || 'Failed to fetch tracking data');
      // keep modal open; show error inside summary card via exceptionNote
      setShipment({
        trackingCode: code,
        statusName: 'Not Found',
        exceptionNote: e?.message || 'No record found for this code.',
        currentIndex: -1,
      });
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

        {/* tabs */}
        <div className="mb-5 flex gap-3">
          <button
            type="button"
            onClick={() => setActiveTab('invoice')}
            className={[
              'px-4 py-2 rounded-full border',
              activeTab === 'invoice' ? 'bg-black text-white border-black' : 'bg-gray-100 text-gray-800 border-gray-200'
            ].join(' ')}
          >
            Invoice No.
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('tracking')}
            className={[
              'px-4 py-2 rounded-full border',
              activeTab === 'tracking' ? 'bg-black text-white border-black' : 'bg-gray-100 text-gray-800 border-gray-200'
            ].join(' ')}
          >
            Tracking No
          </button>
        </div>

        {/* form */}
        <form onSubmit={handleSubmit}>
          {activeTab === 'invoice' ? (
            <input
              type="text"
              placeholder="Invoice Number"
              className="tracking-input mb-6 block w-full bg-gray-100 rounded-xl px-5 py-3 text-lg text-gray-800 outline-none"
              value={invoiceNumber}
              onChange={(e) => setInvoiceNumber(e.target.value)}
            />
          ) : (
            <input
              type="text"
              placeholder="Tracking Number"
              className="tracking-input mb-6 block w-full bg-gray-100 rounded-xl px-5 py-3 text-lg text-gray-800 outline-none"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
            />
          )}

          <button
            className="tracking-otp-btn w-full bg-black text-white font-semibold text-lg py-3 flex items-center justify-center gap-2 rounded-xl"
            type="submit"
          >
            {loading ? 'Fetching…' : 'Track your order'} <MdOutlineLocationOn />
          </button>

          {!valid && (
            <p className="text-red-500 text-sm mt-2">
              Please enter a valid number (min 6 characters)
            </p>
          )}
          {error && (
            <p className="text-amber-600 text-sm mt-2">
              {error}
            </p>
          )}
        </form>
      </div>

      {/* modal */}
      <TrackingModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        shipment={shipment}
      />
    </>
  );
};

export default TrackingForm;
