'use client';

import React, { useEffect } from 'react';
import { FiPackage, FiTruck, FiMapPin, FiCheckCircle, FiX } from 'react-icons/fi';
import type { IconType } from 'react-icons';
import '../trackingpage/TrackingPageStyles.css'; // reuse same classes: progressBar, progressBarActive, nodeGlow, track-*

/* ------------------------------- Types ---------------------------------- */
type StageKey = 'booked' | 'in_transit' | 'arrival' | 'out_for_delivery' | 'delivered';

type Stage = {
  key: StageKey;
  title: string;
  alt: string;
  icon: IconType;
};

export type TrackingModalShipment = {
  trackingCode?: string;
  method?: 'Air' | 'Sea' | 'Road' | string;
  statusName?: string;
  status?: string;        // allow either name/status like in page
  statusId?: number;
  updatedAt?: string;
  currentIndex?: number;  // optional, if provided we use it directly
  exceptionNote?: string;
};

type TrackingModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  shipment?: TrackingModalShipment;
};

/* ------------------------------ UI Copy --------------------------------- */
const STAGES: Stage[] = [
  { key: 'booked',            title: 'Shipment Booked',        alt: 'Received/Pending',   icon: FiPackage },
  { key: 'in_transit',        title: 'In Transit',             alt: 'Forwarded/Transfer', icon: FiTruck   },
  { key: 'arrival',           title: 'Arrival & Clearance',    alt: 'Arrived/Clearing',   icon: FiMapPin  },
  { key: 'out_for_delivery',  title: 'Out for Delivery',       alt: 'Delivery Arranged',  icon: FiTruck   },
  { key: 'delivered',         title: 'Delivered',              alt: 'Complete',           icon: FiCheckCircle },
];

/* ----------------------- Status → Stage Mapping ------------------------- */
/* Copied to match TrackingJourney’s logic */
const STATUS_ID_TO_STAGE: Record<number, number> = {
  1: 0, 2: 0, 11: 0, 13: 0,     // Booking
  3: 1, 12: 1, 14: 1,           // In-transit
  4: 2, 5: 2, 6: 2, 7: 2,       // Arrival/Clearance
  8: 3, 9: 3, 10: 3,            // OFD
  // Delivered handled by names fallback
};

const STATUS_NAME_TO_STAGE: Record<string, number> = {
  'shipment received': 0, 'shipment booked': 0, 'pending': 0, 'enquiry collected': 0,
  'shipment forwarded': 1, 'more tracking': 1, 'transfer': 1,
  'shipment arrived': 2, 'waiting for clearance': 2, 'shipment on hold': 2, 'shipment cleared': 2,
  'delivery arranged': 3, 'shipment out for delivery': 3, 'not delivered': 3,
  'delivered': 4,
};

const EXCEPTION_NAMES = new Set(['shipment on hold', 'not delivered']);

function deriveStageIndexFromFields(payload?: {
  status_name?: string;
  status?: string;
  status_id?: number;
}) {
  const detail = (payload?.status_name || payload?.status || '').trim();
  let exception = false;

  if (typeof payload?.status_id === 'number') {
    const idx = STATUS_ID_TO_STAGE[payload.status_id];
    if (idx !== undefined) {
      if (detail && EXCEPTION_NAMES.has(detail.toLowerCase())) exception = true;
      return { index: idx, exception, detail };
    }
  }

  const key = detail.toLowerCase();
  if (STATUS_NAME_TO_STAGE[key] !== undefined) {
    if (EXCEPTION_NAMES.has(key)) exception = true;
    return { index: STATUS_NAME_TO_STAGE[key], exception, detail };
  }

  if (/deliver/i.test(detail)) return { index: /not/i.test(detail) ? 3 : 4, exception, detail };
  if (/out/i.test(detail)) return { index: 3, exception, detail };
  if (/arriv|dest|clear/i.test(detail)) return { index: 2, exception, detail };
  if (/transit|forward|transfer/i.test(detail)) return { index: 1, exception, detail };
  if (/book|receiv|enquiry|pending/i.test(detail)) return { index: 0, exception, detail };

  return { index: -1, exception, detail };
}

/* --------------------------- Component (stable hooks) -------------------- */
const TrackingModal: React.FC<TrackingModalProps> = ({ open, onOpenChange, shipment }) => {
  // lock scroll — single hook, same order every render
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = open ? 'hidden' : prev;
    return () => { document.body.style.overflow = prev; };
  }, [open]);

  if (!open) return null;

  const code = (shipment?.trackingCode || '').trim();
  const hasQuery = code.length > 0;

  // derive current stage index — no hooks here
  let currentIndex = -1;
  if (typeof shipment?.currentIndex === 'number') {
    currentIndex = Math.max(0, Math.min(4, shipment.currentIndex));
  } else {
    const { index } = deriveStageIndexFromFields({
      status_name: shipment?.statusName,
      status: shipment?.status,
      status_id: shipment?.statusId,
    });
    currentIndex = index;
  }

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-[999] bg-black/40" onClick={() => onOpenChange(false)} />

      {/* Panel (center on desktop, bottom-sheet on mobile) */}
      <div className="fixed inset-0 z-[1000] flex items-end sm:items-center justify-center p-0 sm:p-6">
        <div
          className="w-full sm:w-[min(92vw,980px)] max-h-[90vh] overflow-y-auto rounded-t-3xl sm:rounded-2xl bg-white shadow-2xl p-4 sm:p-6"
          role="dialog"
          aria-modal="true"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="mb-4 flex items-start justify-between">
            <div>
              <h3 className="text-lg font-semibold">Tracking Details</h3>
              <p className="text-xs text-neutral-500">Real-time milestone view from booking to delivery.</p>
            </div>
            <button
              onClick={() => onOpenChange(false)}
              className="rounded-full p-2 text-neutral-600 hover:bg-neutral-100"
              aria-label="Close"
            >
              <FiX />
            </button>
          </div>

          {/* Body */}
          <div className="grid gap-5 lg:grid-cols-3">
            {/* Summary card (left) */}
            <div className="lg:col-span-1">
              <div className="rounded-2xl border border-neutral-200 p-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded bg-yellow-100 px-2 py-1 text-xs font-semibold text-yellow-900">
                    {code || '—'}
                  </span>
                  {shipment?.method && (
                    <span className="rounded bg-neutral-100 px-2 py-1 text-xs text-neutral-700">{shipment.method}</span>
                  )}
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                  <div className="col-span-2 rounded-xl bg-neutral-50 p-3">
                    <p className="text-[11px] uppercase text-neutral-500">Current Status</p>
                    <p className="font-medium">
                      {hasQuery ? (shipment?.statusName || shipment?.status || '—') : 'Enter a code to view'}
                    </p>
                    <p className="mt-1 text-xs text-neutral-500">
                      {hasQuery ? (shipment?.updatedAt ? `Updated on ${shipment.updatedAt}` : 'Updated recently') : ' '}
                    </p>
                    {shipment?.exceptionNote && (
                      <span className="mt-2 inline-block rounded-full bg-amber-100 px-3 py-1 text-[11px] font-semibold text-amber-800">
                        {shipment.exceptionNote}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Journey (right) — render only when code exists */}
            <div className="lg:col-span-2">
              {hasQuery ? (
                <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-5">
                  <ol className="relative mx-auto sm:flex sm:flex-col sm:w-full lg:grid lg:grid-cols-5 gap-0">
                    {STAGES.map((s, i) => {
                      const Icon = s.icon;
                      const reached = i <= currentIndex && currentIndex >= 0;
                      const isCurrent = i === currentIndex && currentIndex >= 0;

                      return (
                        <li key={s.key} className="track-list-flex relative flex sm:flex-col items-center text-center sm:w-full lg:w-auto">
                          {i !== 0 && (
                            <div
                              className={[
                                'absolute left-0 right-0 top-4 h-1',
                                i <= currentIndex && currentIndex >= 0 ? 'progressBarActive' : 'progressBar',
                              ].join(' ')}
                            />
                          )}

                          <div className="relative z-10 flex h-8 w-8 items-center justify-center">
                            <div className={['absolute inset-0 rounded-full', reached ? 'nodeGlow' : 'bg-neutral-200'].join(' ')} />
                            <Icon size={20} className={reached ? 'text-black' : 'text-neutral-400'} />
                          </div>

                          <div className="track-title-description text-xs font-medium text-black">
                            <h2 className="track-form-data-heading">{s.title}</h2>
                            <p className="track-form-data-sub-heading">{s.alt}</p>
                          </div>

                          {isCurrent && (
                            <div className="mt-2 rounded-full bg-emerald-500/10 px-3 py-1 text-[10px] font-semibold text-emerald-600">
                              In progress
                            </div>
                          )}
                        </li>
                      );
                    })}
                  </ol>
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-neutral-200 p-5 text-center text-sm text-neutral-500">
                  Enter a Tracking/Invoice number to view the journey.
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="mt-4 flex justify-end gap-2 border-t border-neutral-200 pt-4">
            <button
              className="rounded-md border border-neutral-300 px-4 py-2 text-sm hover:bg-neutral-50"
              onClick={() => onOpenChange(false)}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default TrackingModal;
