'use client';

import React, { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation'; // Import useRouter
import { FiSearch } from 'react-icons/fi';
import { MdOutlineLocationOn } from 'react-icons/md';
import { fetchTrackingData, fetchTrackingByInvoice } from '@/app/api/trackingApi';
import "./TrackfromStyles.css";

/* ------------------------------- Types ---------------------------------- */
type Mode = 'tracking';
type ActiveTab = 'tracking' | 'invoice';

export type TrackResponse = {
  tracking_code?: string;
  tracking_no?: string;
  status_name?: string;
  status?: string | number;
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

/* --------------------------- Input helpers ------------------------------ */
// 3, 6, or 9 digits
const isNumericOnly = (v: string) => /^\d+$/.test(v.trim());
// Letter prefix + hyphen + rest
const isLetterHyphenInvoice = (v: string) => /^[A-Za-z]+-[A-Za-z0-9-]+$/.test(v.trim());
// Invoice patterns
const isInvoicePattern = (v: string) => /^INV[-/][A-Za-z0-9-]+$/i.test(v.trim());
// Accept letter prefix followed by numbers
const isAlphaNumeric = (v: string) => /^[A-Za-z]+[0-9]+[A-Za-z0-9]*$/.test(v.trim());
// Any value that should go to /tracks
const isInvoiceQuery = (v: string) =>
  isNumericOnly(v) || isLetterHyphenInvoice(v) || isInvoicePattern(v) || isAlphaNumeric(v);
// Allow 3+ chars
const isValidCodeInput = (v: string) => /^[A-Za-z0-9\-/:]{3,}$/i.test(v.trim());

/* --------------------------------- UI ----------------------------------- */
const TrackingForm: React.FC = () => {
  const router = useRouter(); // Initialize Router
  const [activeTab, setActiveTab] = useState<ActiveTab>('tracking');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [invoiceNumber, setInvoiceNumber] = useState('');

  // UX states
  const [touched, setTouched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Validate current tab value
  const currentValue = activeTab === 'invoice' ? invoiceNumber : trackingNumber;
  const valid = useMemo(() => {
    if (!touched && currentValue.length === 0) return false;
    return activeTab === 'invoice'
      ? isInvoiceQuery(currentValue)
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
      const useInvoiceEndpoint = activeTab === 'invoice' || isInvoiceQuery(query);

      // We fetch here just to validate that the record exists before redirecting
      // If you don't care about validation, you can remove this fetch and just redirect immediately.
      const data: TrackResponse = useInvoiceEndpoint
        ? await fetchTrackingByInvoice(query)
        : await fetchTrackingData(query);
      
      // Basic check if data returned is valid (adjust based on your API response structure)
      if (!data) {
        throw new Error("No data found");
      }

      // If successful, redirect to order details page
      // We pass the query and the type (invoice or tracking) via URL parameters
      // Example URL: /order-details?id=12345&type=invoice
      const targetUrl = `/Orderdetails?id=${encodeURIComponent(query)}&type=${useInvoiceEndpoint ? 'invoice' : 'tracking'}`;
      
      router.push(targetUrl);

    } catch (err) {
      // Stay on this page and show error
      setErrorMsg('Tracking number not found. Please check the number and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="tracking-form-box w-full max-w-md bg-white shadow-lg mx-auto relative rounded-2xl">
      <h2 className="mb-2 tracking-form-heading text-xl font-semibold">Track Order Form</h2>

      {/* Tabs */}
      <div className="mb-8 flex rounded-xl overflow-hidden border border-neutral-200">
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
            placeholder="Invoice or Bill Number (e.g., 12345, R0003, INV-xxxx)"
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
              ? <>Enter a valid invoice or bill number (e.g., 12345, R0003, INV-xxxx).</>
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
      <div className="mt-2 flex items-center gap-2 text-xs text-neutral-600">
        <MdOutlineLocationOn size={16} />
        Live milestone view from booking to delivery
      </div>
    </div>
  );
};

export default TrackingForm;