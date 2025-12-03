"use client"

import "./TrackingPageStyles.css"
import { IoSearchOutline } from "react-icons/io5";

const OrderForm = () => {
  return (
    <>
        <div className="track-order-form">
            <form action="">
                 <div className="flex flex-col gap-3 sm:flex-row">
                              <label className="sr-only" htmlFor="track-input">Enter Invoice Number</label>
                              <input
                                id="track-input"                   
                                inputMode="text"
                                placeholder="Enter Invoice Number / Tracking code"
                                className="w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 text-base outline-none transition placeholder:text-neutral-500 focus:border-neutral-400 focus:bg-white focus:shadow-[0_0_0_3px_rgba(59,130,246,0.25)]"
                              />
                              <button type="submit" className="track-form-btn inline-flex items-center gap-2 rounded-xl bg-black text-white px-4 py-3 disabled:opacity-60">
                                <IoSearchOutline size={16} className="shrink-0" />
                              </button>
                            </div>
            </form>
        </div>
    </>
  )
}

export default OrderForm