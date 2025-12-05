"use client";

import { useState } from "react";
import { useRouter } from "next/navigation"; 
import { IoSearchOutline } from "react-icons/io5";
import { CgSpinner } from "react-icons/cg";
import "./TrackingPageStyles.css";

// --- FULL SCREEN LOADER (No Pulse) ---
const FullScreenLoader = () => (
  <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white/95 backdrop-blur-sm">
    <div className="flex flex-col items-center gap-4">
      <CgSpinner className="animate-spin text-black" size={60} />
      <h2 className="text-xl font-bold text-black">Searching Shipment...</h2>
    </div>
  </div>
);

const OrderForm = () => {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true); 
    
 setTimeout(() => {
        router.push(`/Orderdetails/shipment?invoice=${encodeURIComponent(query.trim())}`);
    }, 100);
  };

  return (
    <>
      {loading && <FullScreenLoader />}
      
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
              <IoSearchOutline size={25} />
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default OrderForm;