"use client";

import { useState } from "react";
import { useRouter } from "next/navigation"; 
import { IoSearchOutline } from "react-icons/io5";
import { CgSpinner } from "react-icons/cg";
import "./TrackingPageStyles.css";

const OrderForm = () => {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    
    // UPDATED: Standardized URL to match TrackingForm (?id=...&type=...)
    // This ensures both forms send data to the page in the exact same way.
    router.push(`/Orderdetails?id=${encodeURIComponent(query.trim())}&type=tracking`);
  };

  return (
    <div className="track-order-form">
      <div className="track-order-form-heading">
        <h4>Track Now!</h4>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col gap-3 sm:flex-row">
          <label className="sr-only" htmlFor="track-input">Enter Invoice Number</label>
          <input
            id="track-input"
            inputMode="text"
            placeholder="Enter Invoice Number / Tracking code"
            className="w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 text-base outline-none transition placeholder:text-neutral-500 focus:border-neutral-400 focus:bg-white focus:shadow-[0_0_0_3px_rgba(59,130,246,0.25)]"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            disabled={loading}
          />
          <button 
            type="submit" 
            disabled={loading}
            className="track-form-btn inline-flex items-center justify-center gap-2 rounded-xl bg-black text-white px-4 py-3 disabled:opacity-60 min-w-[60px]"
          >
            {loading ? <CgSpinner className="animate-spin" size={25} /> : <IoSearchOutline size={25} />}
          </button>
        </div>
      </form>
    </div>
  );
};

export default OrderForm;