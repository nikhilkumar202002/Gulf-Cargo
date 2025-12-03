"use client";

import { BiPhoneCall } from "react-icons/bi";
import "./CommonStyles.css";

export default function CallButton() {
  const onClick = () => {
    // This will trigger the phone dialer
    window.location.href = "tel:+966547619393"; 
  };

  return (
    <div className="wrap">
      <button
        type="button"
        aria-label="Call Us"
        title="Call Us"
        className="btn"
        onClick={onClick}
      >
        <span className="icon"><BiPhoneCall /></span>
      </button>
      <span className="tooltip">Call Us</span>
    </div>
  );
}