'use client';

import React, { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FiSearch } from 'react-icons/fi';
import { MdOutlineLocationOn } from 'react-icons/md';
import { CgSpinner } from "react-icons/cg"; 
import "./TrackfromStyles.css";

/* ------------------------------- Types ---------------------------------- */
type ActiveTab = 'tracking' | 'invoice';

/* --------------------------- Input helpers ------------------------------ */
const isNumericOnly = (v: string) => /^\d+$/.test(v.trim());
const isLetterHyphenInvoice = (v: string) => /^[A-Za-z]+-[A-Za-z0-9-]+$/.test(v.trim());
const isInvoicePattern = (v: string) => /^INV[-/][A-Za-z0-9-]+$/i.test(v.trim());
const isAlphaNumeric = (v: string) => /^[A-Za-z]+[0-9]+[A-Za-z0-9]*$/.test(v.trim());
const isInvoiceQuery = (v: string) =>
  isNumericOnly(v) || isLetterHyphenInvoice(v) || isInvoicePattern(v) || isAlphaNumeric(v);
const isValidCodeInput = (v: string) => /^[A-Za-z0-9\-/:]{3,}$/i.test(v.trim());

/* --------------------------------- UI ----------------------------------- */
const TrackingForm: React.FC = () => {
  const router = useRouter(); 
  const [activeTab, setActiveTab] = useState<ActiveTab>('tracking');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [invoiceNumber, setInvoiceNumber] = useState('');

  const [touched, setTouched] = useState(false);
  const [loading, setLoading] = useState(false);

  const currentValue = activeTab === 'invoice' ? invoiceNumber : trackingNumber;
  const valid = useMemo(() => {
    if (!touched && currentValue.length === 0) return false;
    return activeTab === 'invoice'
      ? isInvoiceQuery(currentValue)
      : isValidCodeInput(currentValue);
  }, [activeTab, currentValue, touched]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    if (!valid) return;

    setLoading(true);

    // FIX: Instant redirect. Let the OrderDetails page handle fetching and errors.
    // This prevents the "Double Loader" issue.
    const query = currentValue.trim();
    const targetUrl = `/Orderdetails/shipment?invoice=${encodeURIComponent(query)}`;
    
    router.push(targetUrl);
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
            {loading ? <CgSpinner className="animate-spin" size={20} /> : <FiSearch size={16} />}
            {loading ? ' Processing...' : ' Track Now'}
          </span>
        </button>
      </form>

      <div className="mt-2 flex items-center gap-2 text-xs text-neutral-600">
        <MdOutlineLocationOn size={16} />
        Live milestone view from booking to delivery
      </div>
    </div>
  );
};

export default TrackingForm;