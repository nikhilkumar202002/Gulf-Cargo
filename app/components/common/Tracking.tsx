"use client";

import { IoLocation } from "react-icons/io5";
import styles from "./Tracking.module.css";

export default function Tracking() {
  const onClick = () => {
    window.location.href = "/trackorder"; 
  };

  return (
    <div className={styles.wrap}>
      <button
        type="button"
        aria-label="Track shipment"
        title="Track shipment"
        className={styles.btn}
        onClick={onClick}
      >
        <span className={styles.icon}><IoLocation /></span>
      </button>
      <span className={styles.tooltip}>Track Shipment</span>
    </div>
  );
}
