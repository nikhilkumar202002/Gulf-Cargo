import { BsBoxSeam, BsAirplane, BsHouseCheck } from 'react-icons/bs';
import { FaPlaneDeparture, FaWarehouse } from 'react-icons/fa';
import { fetchTrackingData, fetchTrackingByInvoice } from '../api/trackingApi'; // Adjust path as needed

/* --- Configuration --- */
export const STAGES = [
  { key: 'booked',            title: 'Shipment Booked',        alt: 'Received/Pending',   icon: BsBoxSeam },
  { key: 'in_transit',        title: 'In Transit',             alt: 'Forwarded/Transfer', icon: FaPlaneDeparture },
  { key: 'arrival',           title: 'Arrival & Clearance',    alt: 'Arrived/Clearing',   icon: FaWarehouse  },
  { key: 'out_for_delivery',  title: 'Out for Delivery',       alt: 'Delivery Arranged',  icon: BsAirplane   },
  { key: 'delivered',         title: 'Delivered',              alt: 'Complete',           icon: BsHouseCheck },
];

/* --- Helpers --- */
const STATUS_ID_TO_STAGE: Record<number, number> = {
  1: 0, 2: 0, 11: 0, 13: 0, // Booked
  3: 1, 12: 1, 14: 1,       // Transit
  4: 2, 5: 2, 6: 2, 7: 2,   // Arrival
  8: 3, 9: 3, 10: 3,        // Out for delivery
  15: 4,                    // Delivered
};

const RAW_TO_DISPLAY: Record<string, string> = {
  'shipment received': 'Shipment Booked',
  'shipment booked': 'Shipment Booked',
  'pending': 'Shipment Booked',
  'shipment forwarded': 'In Transit',
  'shipment arrived': 'Arrival & Clearance',
  'waiting for clearance': 'Arrival & Clearance',
  'shipment out for delivery': 'Out for Delivery',
  'delivered': 'Delivered',
  // ... (Add rest from original file if needed)
};

export const normalizeKey = (s: string) => (s || '').trim().replace(/\s+/g, ' ').toLowerCase();

export function resolveStatus(payload: any) {
  if (!payload) return { stageIndex: -1, displayLabel: '', raw: '' };

  const id = payload.status_id || payload.statusId;
  const textLabel = payload.status_name || payload.status;

  // 1. Try ID Match
  if (id !== null && STATUS_ID_TO_STAGE[id] !== undefined) {
    const stageIndex = STATUS_ID_TO_STAGE[id];
    return { stageIndex, displayLabel: STAGES[stageIndex].title, raw: String(id) };
  }

  // 2. Try Text Match Logic
  if (textLabel) {
    const key = normalizeKey(textLabel);
    
    // Quick regex fallback similar to original file
    let idx = 0;
    if (/deliver/i.test(key)) idx = /not/.test(key) ? 3 : 4;
    else if (/out/.test(key)) idx = 3;
    else if (/arriv|dest|clear/.test(key)) idx = 2;
    else if (/transit|forward|transfer/.test(key)) idx = 1;
    
    return { stageIndex: idx, displayLabel: STAGES[idx].title, raw: textLabel };
  }

  return { stageIndex: 0, displayLabel: 'Shipment Booked', raw: '' };
}

/* --- Fetcher --- */
export const fetchSmart = async (q: string) => {
  const s = q.trim();
  // Simple check: if alphanumeric with hyphen likely invoice, else tracking
  const isInvoice = /^[A-Za-z]+-[A-Za-z0-9-]+$/.test(s) || /^INV/i.test(s);
  
  if (isInvoice) return fetchTrackingByInvoice(s);
  return fetchTrackingData(s);
};