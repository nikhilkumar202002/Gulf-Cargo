'use client';

import React from 'react';
import { FiPackage, FiTruck, FiMapPin, FiCheckCircle } from 'react-icons/fi';
import type { IconType } from 'react-icons';

export type TrackingModalShipment = {
  trackingCode: string;
  method?: string;
  statusName?: string;         // raw label if any
  statusId?: number;           // numeric if present
  status?: string;             // raw status field
  origin?: string;
  originPort?: string;
  destination?: string;
  destinationPort?: string;
  updatedAt?: string;
  exceptionNote?: string;
  currentIndex: number;        // -1..4 (neutral when -1)
  displayStatus?: string;      // normalized label for chip
};

type TrackingModalProps = {
  open: boolean;
  onClose: () => void;
  shipment: TrackingModalShipment | null;
};

/* ------------------------------ Timeline -------------------------------- */
interface Stage {
  key: 'booked' | 'in_transit' | 'arrival' | 'out_for_delivery' | 'delivered';
  title: string;
  alt: string;
  icon: IconType;
}

const STAGES: Stage[] = [
  { key: 'booked',            title: 'Shipment Booked',        alt: 'Received/Pending',   icon: FiPackage },
  { key: 'in_transit',        title: 'In Transit',             alt: 'Forwarded/Transfer', icon: FiTruck   },
  { key: 'arrival',           title: 'Arrival & Clearance',    alt: 'Arrived/Clearing',   icon: FiMapPin  },
  { key: 'out_for_delivery',  title: 'Out for Delivery',       alt: 'Delivery Arranged',  icon: FiTruck   },
  { key: 'delivered',         title: 'Delivered',              alt: 'Complete',           icon: FiCheckCircle },
];

/* -------------------------------- Modal --------------------------------- */
const TrackingModal: React.FC<TrackingModalProps> = ({ open, onClose, shipment }) => {
  if (!open) return null;

  const currentIndex = shipment?.currentIndex ?? -1;
  const statusText =
    (shipment?.displayStatus ||
      (shipment?.statusName || shipment?.status || '').trim() ||
      '');

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-3xl rounded-2xl bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-neutral-200 p-5">
          <div>
            <h2 className="text-xl font-semibold tracking-tight">Tracking Details</h2>
            <p className="text-xs text-neutral-600">Live milestone view</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border px-3 py-1 text-sm hover:bg-neutral-50"
            aria-label="Close"
          >
            Close
          </button>
        </div>

        {/* Identifiers */}
        <div className="p-5 pt-4">
          <div className="flex flex-wrap items-center gap-2 text-sm">
            {shipment?.trackingCode && (
              <span className="px-2 py-1 rounded bg-yellow-100 text-yellow-900 font-semibold">
                {shipment.trackingCode}
              </span>
            )}
            {shipment?.method && (
              <span className="px-2 py-1 rounded bg-emerald-100 text-emerald-900">
                {shipment.method}
              </span>
            )}
            {statusText && (
              <span className="px-2 py-1 rounded bg-neutral-100 text-neutral-900">
                {statusText}
              </span>
            )}
            {shipment?.updatedAt && (
              <span className="px-2 py-1 rounded bg-indigo-50 text-indigo-900">
                Updated {new Date(shipment.updatedAt).toLocaleString()}
              </span>
            )}
          </div>
        </div>

        {/* Stages */}
        <div className="px-5 pb-5">
          <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-5">
            <ol className="relative mx-auto sm:flex sm:flex-col sm:w-full lg:grid lg:grid-cols-5 gap-0">
              {STAGES.map((s, i) => {
                const Icon = s.icon;
                const reached = i <= currentIndex && currentIndex >= 0;
                const isCurrent = i === currentIndex && currentIndex >= 0;

                return (
                  <li key={s.key} className="relative flex sm:flex-col items-center text-center">
                    {i !== 0 && (
                      <div
                        className={[
                          'absolute left-0 right-0 top-4 h-1',
                          reached ? 'bg-emerald-400' : 'bg-neutral-200',
                        ].join(' ')}
                      />
                    )}
                    <div className="relative z-10 flex h-8 w-8 items-center justify-center">
                      <div className={['absolute inset-0 rounded-full', reached ? 'bg-emerald-200' : 'bg-neutral-200'].join(' ')} />
                      <Icon size={20} className={reached ? 'text-black' : 'text-neutral-400'} />
                    </div>
                    <div className="mt-2 text-xs font-medium text-black">
                      <div>{s.title}</div>
                      <div className="text-neutral-500">{s.alt}</div>
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
        </div>

        {/* Meta grid */}
        {(shipment?.origin ||
          shipment?.destination ||
          shipment?.originPort ||
          shipment?.destinationPort) && (
          <div className="px-5 pb-6">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 text-sm">
              {shipment?.origin && (
                <div className="rounded-lg border p-3">
                  <div className="text-neutral-500">Origin</div>
                  <div className="font-medium">{shipment.origin}</div>
                </div>
              )}
              {shipment?.destination && (
                <div className="rounded-lg border p-3">
                  <div className="text-neutral-500">Destination</div>
                  <div className="font-medium">{shipment.destination}</div>
                </div>
              )}
              {shipment?.originPort && (
                <div className="rounded-lg border p-3">
                  <div className="text-neutral-500">Origin Port</div>
                  <div className="font-medium">{shipment.originPort}</div>
                </div>
              )}
              {shipment?.destinationPort && (
                <div className="rounded-lg border p-3">
                  <div className="text-neutral-500">Destination Port</div>
                  <div className="font-medium">{shipment.destinationPort}</div>
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
