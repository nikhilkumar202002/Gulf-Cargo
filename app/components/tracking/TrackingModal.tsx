'use client';

import React from 'react';
import {
  BsBoxSeam,
  BsAirplane,
  BsHouseCheck,
} from 'react-icons/bs';
import { FaPlaneDeparture, FaWarehouse } from 'react-icons/fa';
import { motion } from 'framer-motion';

export type TrackingModalShipment = {
  trackingCode: string;
  method?: string;
  statusName?: string;     // raw label if present
  statusId?: number;       // numeric ID (we will NOT show this)
  status?: string;         // raw status field
  origin?: string;
  destination?: string;
  originPort?: string;
  destinationPort?: string;
  updatedAt?: string;
  currentIndex: number;    // 0..4 (or -1 when unknown)
  displayStatus?: string;  // normalized label from TrackingForm
};

type TrackingModalProps = {
  open: boolean;
  onClose: () => void;
  shipment: TrackingModalShipment | null;
};

/* -------------------------- Timeline configuration -------------------------- */
// Keep your five statuses (icons instead of numbers)
const STAGES = [
  { key: 'booked',           title: 'Shipment Booked',      date: 'May 26, 2024', icon: BsBoxSeam },
  { key: 'in_transit',       title: 'In Transit',           date: 'May 27, 2024', icon: FaPlaneDeparture },
  { key: 'arrival',          title: 'Arrival & Clearance',  date: 'May 29, 2024', icon: FaWarehouse },
  { key: 'out_for_delivery', title: 'Out for Delivery',     date: 'May 30, 2024', icon: BsAirplane },
  { key: 'delivered',        title: 'Delivered',            date: 'June 06, 2024', icon: BsHouseCheck },
] as const;

const TrackingModal: React.FC<TrackingModalProps> = ({ open, onClose, shipment }) => {
  if (!open) return null;

  const currentIndex = shipment?.currentIndex ?? -1;

  // Status chip: prefer normalized label; never show a bare number
  const safeText = (s?: string) => {
    if (!s) return '';
    const trimmed = s.trim();
    return /^\d+$/.test(trimmed) ? '' : trimmed;
  };
  const statusText =
    safeText(shipment?.displayStatus) ||
    safeText(shipment?.statusName) ||
    safeText(shipment?.status) ||
    '';

  // --- PROGRESS CALC ---
  // We render a "track" strip that spans exactly from the center of the first icon
  // to the center of the last icon. The green progress grows *within that track*,
  // so it cannot exceed delivered.
  const steps = STAGES.length;            // 5
  const segments = steps - 1;             // 4
  const progressPct = currentIndex < 0 ? 0 : Math.min(Math.max(currentIndex / segments, 0), 1) * 100;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3 sm:p-6"
      onClick={onClose}
    >
      <div
        className="w-full max-w-5xl rounded-3xl bg-white shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex flex-wrap items-start justify-between border-b border-neutral-200 p-5 sm:p-6">
          <div>
            <h2 className="text-lg sm:text-xl font-semibold tracking-tight text-gray-900">
              Tracking Details
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600">
              Live milestone view from booking to delivery
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-gray-300 px-3 py-1 text-sm hover:bg-gray-50"
            aria-label="Close"
          >
            Close
          </button>
        </div>

        {/* Meta chips */}
        <div className="px-5 pt-4 pb-3 flex flex-wrap items-center gap-2 text-sm">
          {shipment?.trackingCode && (
            <span className="px-3 py-1.5 rounded-full bg-amber-100 text-amber-900 font-semibold">
              {shipment.trackingCode}
            </span>
          )}
          {shipment?.method && (
            <span className="px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-800 font-medium">
              {shipment.method}
            </span>
          )}
          {statusText && (
            <span className="px-3 py-1.5 rounded-full bg-gray-100 text-gray-800 font-medium">
              {statusText}
            </span>
          )}
          {shipment?.updatedAt && (
            <span className="px-3 py-1.5 rounded-full bg-indigo-50 text-indigo-900 font-medium">
              Updated {new Date(shipment.updatedAt).toLocaleString()}
            </span>
          )}
        </div>

        {/* Timeline */}
        <div className="px-4 sm:px-8 pb-8 pt-4">
          <div className="relative">
            {/* Layout row (icons + labels) */}
            <div className="relative flex flex-col sm:flex-row items-center justify-between w-full gap-10 sm:gap-0">

              {/*
                Track container:
                - Positioned between the first and last icon centers using left/right paddings based on N steps.
                - All animated children (green line + dot) are positioned inside THIS container,
                  so they physically cannot exceed delivered.
              */}
              <div
                className="
                  pointer-events-none
                  absolute top-[44%] sm:top-[44%]
                  -translate-y-1/2
                  left-[calc(100%/(2*5))] right-[calc(100%/(2*5))]
                  h-0
                "
              >
                {/* Dashed base line (full track length) */}
                <div className="h-[2px] sm:h-[3px] w-full border-t-2 border-dashed border-gray-300" />

                {/* Animated progress fill (within track) */}
                <motion.div
                  className="absolute top-0 left-0 h-[2px] sm:h-[3px] bg-emerald-500 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPct}%` }}
                  transition={{ duration: 1.8, ease: 'easeInOut' }}
                />

                {/* Traveling dot (within track) */}
                <motion.div
                  className="absolute top-0 h-3 w-3 rounded-full bg-emerald-500 shadow-[0_0_8px_#10B981]"
                  initial={{ left: '0%' }}
                  animate={{ left: `${progressPct}%` }}
                  transition={{ duration: 1.8, ease: 'easeInOut' }}
                  style={{ transform: 'translate(-50%, -30%)' }}
                />
              </div>

              {/* Stages */}
              {STAGES.map((stage, i) => {
                const Icon = stage.icon;
                const reached = currentIndex >= 0 && i <= currentIndex;
                const isCurrent = currentIndex >= 0 && i === currentIndex;

                return (
                  <div
                    key={stage.key}
                    className="relative flex flex-col items-center text-center sm:flex-1"
                  >
                    {/* Icon puck */}
                    <div
                      className={[
                        'relative z-10 flex items-center justify-center rounded-full transition-all duration-500',
                        'h-12 w-12 sm:h-14 sm:w-14',
                        reached ? 'bg-green-600 text-white ring-2 ring-green-300' : 'bg-white border-2 border-gray-300 text-gray-400',
                        isCurrent ? 'scale-110' : 'scale-100',
                      ].join(' ')}
                    >
                      <Icon size={22} />
                    </div>

                    {/* Label + date */}
                    <div className="mt-2 text-xs sm:text-sm font-semibold text-gray-800 whitespace-nowrap">
                      {stage.title}
                    </div>
                    <div className="text-[11px] sm:text-xs text-gray-500">
                      {stage.date}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Meta grid (optional) */}
        {(shipment?.origin ||
          shipment?.destination ||
          shipment?.originPort ||
          shipment?.destinationPort) && (
          <div className="px-5 pb-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              {shipment?.origin && (
                <div className="rounded-xl border p-3 bg-gray-50">
                  <div className="text-gray-500 text-xs">Origin</div>
                  <div className="font-medium text-gray-800">{shipment.origin}</div>
                </div>
              )}
              {shipment?.destination && (
                <div className="rounded-xl border p-3 bg-gray-50">
                  <div className="text-gray-500 text-xs">Destination</div>
                  <div className="font-medium text-gray-800">{shipment.destination}</div>
                </div>
              )}
              {shipment?.originPort && (
                <div className="rounded-xl border p-3 bg-gray-50">
                  <div className="text-gray-500 text-xs">Origin Port</div>
                  <div className="font-medium text-gray-800">{shipment.originPort}</div>
                </div>
              )}
              {shipment?.destinationPort && (
                <div className="rounded-xl border p-3 bg-gray-50">
                  <div className="text-gray-500 text-xs">Destination Port</div>
                  <div className="font-medium text-gray-800">{shipment.destinationPort}</div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrackingModal;
