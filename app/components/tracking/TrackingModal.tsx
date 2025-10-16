'use client';

import React from 'react';
import ReactDOM from 'react-dom';
import { FiCheckCircle, FiMapPin, FiPackage, FiTruck } from 'react-icons/fi';
import './TrackfromStyles.css';

export type TrackingModalShipment = {
  trackingCode: string;
  method?: string;
  statusName?: string;
  statusId?: number;
  status?: string;
  origin?: string;
  originPort?: string;
  destination?: string;
  destinationPort?: string;
  updatedAt?: string;
  exceptionNote?: string;
  currentIndex: number; // 0..4
};

type TrackingModalProps = {
  open: boolean;
  onClose: () => void;
  loading?: boolean;
  error?: string;
  shipment?: TrackingModalShipment;
};

const STAGE_LABELS = [
  { title: 'Shipment Booked', alt: 'Received/Pending', icon: FiPackage },
  { title: 'In Transit', alt: 'Forwarded/Transfer', icon: FiTruck },
  { title: 'Arrival & Clearance', alt: 'Arrived/Clearing', icon: FiMapPin },
  { title: 'Out for Delivery', alt: 'Delivery Arranged', icon: FiTruck },
  { title: 'Delivered', alt: 'Complete', icon: FiCheckCircle },
];

const ModalContent: React.FC<TrackingModalProps> = ({ onClose, loading, error, shipment }) => {
  const code = shipment?.trackingCode || '—';
  const method = shipment?.method || '—';
  const statusText = (shipment?.statusName || shipment?.status || '').trim() || '—';
  const isInvoiceOrBill = /^INV[-/]/i.test(code) || /^\d{6}$/.test(code);

  return (
    <div className="tracking-modal-backdrop" role="dialog" aria-modal="true">
      <div className="tracking-modal">
        <div className="tracking-modal-header">
          <h3 className="tracking-modal-title">Tracking Details</h3>
          <button className="tracking-modal-close" onClick={onClose} aria-label="Close">×</button>
        </div>

        <div className="tracking-modal-body">
          {loading && <p className="text-sm text-neutral-700">Fetching latest status…</p>}
          {error && !loading && <p className="text-sm text-red-600">{error}</p>}

          {!loading && !error && (
            <>
              {/* Summary */}
              <div className="rounded-xl border border-neutral-200 bg-white p-4 text-sm">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2 py-1 rounded bg-yellow-100 text-yellow-900 font-semibold">
                    {code}
                  </span>
                  {isInvoiceOrBill && (
                    <span className="px-2 py-1 rounded bg-indigo-100 text-indigo-900">Invoice/Bill</span>
                  )}
                  {method !== '—' && (
                    <span className="px-2 py-1 rounded bg-emerald-100 text-emerald-900">{method}</span>
                  )}
                  {statusText !== '—' && (
                    <span className="px-2 py-1 rounded bg-neutral-100 text-neutral-900">{statusText}</span>
                  )}
                  {shipment?.updatedAt && (
                    <span className="px-2 py-1 rounded bg-neutral-50 text-neutral-700">
                      Updated: {new Date(shipment.updatedAt).toLocaleString()}
                    </span>
                  )}
                </div>

                {(shipment?.origin || shipment?.originPort || shipment?.destination || shipment?.destinationPort) && (
                  <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="rounded-lg bg-neutral-50 p-3">
                      <div className="text-[11px] text-neutral-500">Origin</div>
                      <div className="text-sm font-medium">
                        {shipment?.origin || '—'}
                        {shipment?.originPort ? ` • ${shipment.originPort}` : ''}
                      </div>
                    </div>
                    <div className="rounded-lg bg-neutral-50 p-3">
                      <div className="text-[11px] text-neutral-500">Destination</div>
                      <div className="text-sm font-medium">
                        {shipment?.destination || '—'}
                        {shipment?.destinationPort ? ` • ${shipment.destinationPort}` : ''}
                      </div>
                    </div>
                  </div>
                )}

                {shipment?.exceptionNote && (
                  <div className="mt-3 rounded-lg bg-yellow-50 p-3 text-sm text-yellow-900">
                    Note: {shipment.exceptionNote}
                  </div>
                )}
              </div>

              {/* Stages */}
              <div className="mt-4 rounded-2xl border border-neutral-200 bg-neutral-50 p-5">
                <ol className="relative mx-auto sm:flex sm:flex-col sm:w-full lg:grid lg:grid-cols-5 gap-0">
                  {STAGE_LABELS.map((s, i) => {
                    const Icon = s.icon;
                    const reached = shipment ? i <= shipment.currentIndex && shipment.currentIndex >= 0 : false;
                    const isCurrent = shipment ? i === shipment.currentIndex && shipment.currentIndex >= 0 : false;

                    return (
                      <li key={s.title} className="track-list-flex relative flex sm:flex-col items-center text-center sm:w/full lg:w-auto">
                        {i !== 0 && (
                          <div
                            className={[
                              'absolute left-0 right-0 top-4 h-1',
                              reached ? 'progressBarActive' : 'progressBar',
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
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const TrackingModal: React.FC<TrackingModalProps> = (props) => {
  if (!props.open) return null;

  // Portal to body to avoid stacking/overflow issues
  const node = document.body;
  return ReactDOM.createPortal(<ModalContent {...props} />, node);
};

export default TrackingModal;
