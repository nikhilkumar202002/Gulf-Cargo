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
  statusName?: string;     
  statusId?: number;       
  status?: string;         
  origin?: string;
  destination?: string;
  originPort?: string;
  destinationPort?: string;
  updatedAt?: string;
  currentIndex: number;    
  displayStatus?: string;  
};

type TrackingModalProps = {
  open: boolean;
  onClose: () => void;
  shipment: TrackingModalShipment | null;
};

const STAGES = [
  { key: 'booked',           title: 'Shipment Booked',      icon: BsBoxSeam },
  { key: 'in_transit',       title: 'In Transit',           icon: FaPlaneDeparture },
  { key: 'arrival',          title: 'Arrival & Clearance',  icon: FaWarehouse },
  { key: 'out_for_delivery', title: 'Out for Delivery',     icon: BsAirplane },
  { key: 'delivered',        title: 'Delivered',            icon: BsHouseCheck },
] as const;

const TrackingModal: React.FC<TrackingModalProps> = ({ open, onClose, shipment }) => {
  if (!open) return null;

  const currentIndex = shipment?.currentIndex ?? -1;

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

  // Desktop Horizontal Progress Calculation
  const steps = STAGES.length;            
  const segments = steps - 1;             
  const progressPct = currentIndex < 0 ? 0 : Math.min(Math.max(currentIndex / segments, 0), 1) * 100;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3 sm:p-6"
      onClick={onClose}
    >
      <div
        className="w-full max-w-5xl rounded-3xl bg-white shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
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

        {/* Timeline Container */}
        <div className="px-4 sm:px-8 pb-8 pt-4">
          <div className="relative">
            
            {/* DESKTOP TRACK (Hidden on Mobile) */}
            <div
              className="
                hidden sm:block 
                pointer-events-none
                absolute top-[44%]
                -translate-y-1/2
                left-[calc(100%/(2*5))] right-[calc(100%/(2*5))]
                h-0
              "
            >
              <div className="h-[3px] w-full border-t-2 border-dashed border-gray-300" />
              <motion.div
                className="absolute top-0 left-0 h-[3px] bg-emerald-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progressPct}%` }}
                transition={{ duration: 1.8, ease: 'easeInOut' }}
              />
              <motion.div
                className="absolute top-0 h-3 w-3 rounded-full bg-emerald-500 shadow-[0_0_8px_#10B981]"
                initial={{ left: '0%' }}
                animate={{ left: `${progressPct}%` }}
                transition={{ duration: 1.8, ease: 'easeInOut' }}
                style={{ transform: 'translate(-50%, -30%)' }}
              />
            </div>

            {/* ITEMS LOOP */}
            <div className="relative flex flex-col sm:flex-row sm:items-center justify-between w-full sm:gap-0">
              {STAGES.map((stage, i) => {
                const Icon = stage.icon;
                const reached = currentIndex >= 0 && i <= currentIndex;
                const isCurrent = currentIndex >= 0 && i === currentIndex;
                const isLast = i === STAGES.length - 1;

                // Badge Logic
                let badgeText = 'Pending';
                let badgeClass = 'bg-gray-100 text-gray-500 border-gray-200';

                if (i < currentIndex) {
                    badgeText = 'Completed';
                    badgeClass = 'bg-emerald-100 text-emerald-700 border-emerald-200';
                } else if (isCurrent) {
                    badgeText = 'In Progress';
                    badgeClass = 'bg-blue-100 text-blue-700 border-blue-200';
                }

                return (
                  <div
                    key={stage.key}
                    // Mobile: Row layout (Icon Left, Text Right)
                    // Desktop: Col layout (Icon Top, Text Bottom)
                    className="relative flex flex-row sm:flex-col items-start sm:items-center text-left sm:text-center sm:flex-1 pb-8 sm:pb-0"
                  >
                    
                    {/* MOBILE VERTICAL LINE */}
                    {!isLast && (
                      <div className="block sm:hidden absolute left-[20px] top-10 bottom-0 w-[2px] -ml-[1px]">
                         <div 
                           className={`w-full h-full ${
                             i < currentIndex 
                               ? 'bg-emerald-500' 
                               : 'border-l-2 border-dashed border-gray-300'
                           }`} 
                         />
                      </div>
                    )}

                    {/* Icon Container */}
                    <div className="flex-shrink-0">
                      <div
                        className={[
                          'relative z-10 flex items-center justify-center rounded-full transition-all duration-500',
                          'h-10 w-10 sm:h-14 sm:w-14', 
                          reached ? 'bg-green-600 text-white ring-2 ring-green-300' : 'bg-white border-2 border-gray-300 text-gray-400',
                          isCurrent ? 'scale-110' : 'scale-100',
                        ].join(' ')}
                      >
                        <Icon className="text-[18px] sm:text-[22px]" />
                      </div>
                    </div>

                    {/* Text Container */}
                    <div className="ml-4 sm:ml-0 sm:mt-3 flex flex-col justify-center items-start sm:items-center h-auto">
                      <div className="text-sm sm:text-sm font-bold text-gray-800 mb-1">
                        {stage.title}
                      </div>
                      
                      {/* BADGE (Replaces Date) */}
                      <span className={`px-2 py-0.5 text-[10px] sm:text-[11px] font-medium uppercase tracking-wide rounded border ${badgeClass}`}>
                        {badgeText}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Meta grid */}
        {(shipment?.origin || shipment?.destination || shipment?.originPort || shipment?.destinationPort) && (
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