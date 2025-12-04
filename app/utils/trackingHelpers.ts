import { BsBoxSeam, BsAirplane, BsHouseCheck } from 'react-icons/bs';
import { FaPlaneDeparture, FaWarehouse } from 'react-icons/fa';
import { fetchTrackingData, fetchTrackingByInvoice } from '../api/trackingApi'; 

/* --- 1. SETUP STAGES (Matches your 5-Step Requirement) --- */
export const STAGES = [
  { key: 'received',          title: 'Shipment Received',      alt: 'Booked/Warehouse',   icon: BsBoxSeam },        // Stage 0
  { key: 'in_transit',        title: 'In Transit',             alt: 'Forwarded/Port',     icon: FaPlaneDeparture }, // Stage 1
  { key: 'arrival_clearance', title: 'Arrival & Clearance',    alt: 'Cleared/Process',    icon: FaWarehouse  },     // Stage 2
  { key: 'out_for_delivery',  title: 'Out for Delivery',       alt: 'Delivery Arranged',  icon: BsAirplane   },     // Stage 3
  { key: 'delivered',         title: 'Delivered',              alt: 'Complete',           icon: BsHouseCheck },     // Stage 4
];

/* --- 2. MAP STATUS IDs TO STAGES --- */
const STATUS_ID_TO_STAGE: Record<number, number> = {
  // Stage 0: Shipment Received
  1: 0, 13: 0, 18: 0, 2: 0, 11: 0,
  
  // Stage 1: In Transit (Includes "Shipment Forwarded" - ID 3)
  3: 1,  // Shipment Forwarded -> In Transit
  19: 1, // In Transit
  24: 1, // Arrived at Port (As per your request)
  5: 1,  // Waiting for Clearance (As per your request)
  12: 1, 14: 1,
  
  // Stage 2: Arrival & Clearance
  20: 2, 4: 2, 6: 2,
  7: 2,  // Cleared
  21: 2, // Customs Cleared
  22: 2, // Booking in Progress
  23: 2, // Delivery in Transit
  
  // Stage 3: Out for Delivery
  8: 3, 9: 3, 10: 3,
  
  // Stage 4: Delivered
  15: 4,
};

export function resolveStatus(payload: any) {
  if (!payload) return { stageIndex: -1, displayLabel: '' };

  const id = Number(payload.status_id || payload.statusId || 0);
  const textLabel = payload.status_name || payload.status;

  // 1. Try ID Match (Priority)
  if (id !== 0 && STATUS_ID_TO_STAGE[id] !== undefined) {
    const idx = STATUS_ID_TO_STAGE[id];
    return { stageIndex: idx, displayLabel: STAGES[idx].title };
  }

  // 2. Try Text Match (Fallback)
  if (textLabel) {
    const key = (textLabel || '').toLowerCase();
    
    // Explicit overrides based on your custom staging
    if (key.includes("cleared") || key.includes("booking") || key.includes("delivery in transit")) {
        return { stageIndex: 2, displayLabel: STAGES[2].title };
    }
    if (key.includes("out for") || key.includes("arranged")) {
        return { stageIndex: 3, displayLabel: STAGES[3].title };
    }

    // Standard matching
    let idx = 0;
    if (/deliver/i.test(key) && !/not/i.test(key) && !/out/i.test(key)) idx = 4;
    else if (/out/i.test(key)) idx = 3;
    else if (/arriv|clear|process/i.test(key)) idx = 2;
    else if (/transit|forward|port|waiting/i.test(key)) idx = 1; // "Forward" goes to Stage 1
    
    return { stageIndex: idx, displayLabel: STAGES[idx].title };
  }

  return { stageIndex: 0, displayLabel: 'Shipment Received' };
}

/* --- 3. SMART FETCH (Fixes the Invoice Array Issue) --- */
export const fetchSmart = async (q: string) => {
  const s = q.trim();

  // A. Try Invoice API (for INV-XXX inputs)
  if (/^INV[-/]/i.test(s) || /^[A-Z]+-\d+/.test(s)) {
    try {
        const res = await fetchTrackingByInvoice(s);
        // FIX: Invoice API returns an Array of bills. We must return the first OBJECT.
        if (Array.isArray(res) && res.length > 0) return res[0]; 
        if (Array.isArray(res) && res.length === 0) throw new Error("Invoice found but no shipments listed.");
        return res;
    } catch(err) {
        // Fallthrough to try generic tracking if invoice fails (optional, but safer)
    }
  }

  // B. Try Standard Tracking API
  try {
    return await fetchTrackingData(s);
  } catch (trackingError) {
    // C. Fallback: If it wasn't an INV code but failed Tracking API, try Invoice API as last resort
    try {
      const res = await fetchTrackingByInvoice(s);
      // FIX: Handle Array here too
      if (Array.isArray(res) && res.length > 0) return res[0];
      return res;
    } catch (invoiceError: any) {
      let msg = "Shipment not found.";
      if (invoiceError?.message) msg = invoiceError.message; 
      else if (typeof invoiceError === 'string') {
          try {
             const parsed = JSON.parse(invoiceError);
             if(parsed.message) msg = parsed.message;
          } catch(e) {}
      }
      throw new Error(msg);
    }
  }
};