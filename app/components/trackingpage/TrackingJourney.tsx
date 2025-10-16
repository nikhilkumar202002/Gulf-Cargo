'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { FiSearch, FiPackage, FiTruck, FiMapPin, FiCheckCircle } from 'react-icons/fi';
import type { IconType } from 'react-icons';
import { fetchTrackingData, fetchTrackingByInvoice } from '../../api/trackingApi'; // <-- added import
import './TrackingPageStyles.css';

/* ------------------------------- Types ---------------------------------- */
type Mode = 'tracking';

interface Stage {
  key: 'booked' | 'in_transit' | 'arrival' | 'out_for_delivery' | 'delivered';
  title: string;
  alt: string;
  icon: IconType;
}

type TrackResponse = {
  // generic tracking fields (existing)
  tracking_code?: string;
  tracking_no?: string;
  status_name?: string;
  status?: string;
  status_id?: number;
  method?: string;
  origin?: string;
  origin_port?: string;
  destination?: string;
  destination_port?: string;
  updated_at?: string;

  // invoice-specific fields (NEW)
  success?: boolean;
  invoice_no?: string;
  shipment_method?: string;
  // the invoice endpoint returns "status" as the human label already
  [k: string]: unknown;
};

/* ------------------------------ UI Copy --------------------------------- */
const STAGES: Stage[] = [
  { key: 'booked',            title: 'Shipment Booked',        alt: 'Received/Pending',   icon: FiPackage },
  { key: 'in_transit',        title: 'In Transit',             alt: 'Forwarded/Transfer', icon: FiTruck   },
  { key: 'arrival',           title: 'Arrival & Clearance',    alt: 'Arrived/Clearing',   icon: FiMapPin  },
  { key: 'out_for_delivery',  title: 'Out for Delivery',       alt: 'Delivery Arranged',  icon: FiTruck   },
  { key: 'delivered',         title: 'Delivered',              alt: 'Complete',           icon: FiCheckCircle },
];

const placeholders: Record<Mode, string> = {
  tracking: 'Enter tracking number or Invoice Number',
};

const labelCopy: Record<Mode, string> = {
  tracking: 'Track by Tracking Number or Invoice',
};

/* ----------------------- Status → Stage Mapping ------------------------- */
const STATUS_ID_TO_STAGE: Record<number, number> = {
  1: 0, 2: 0, 11: 0, 13: 0,
  3: 1, 12: 1, 14: 1,
  4: 2, 5: 2, 6: 2, 7: 2,
  8: 3, 9: 3, 10: 3,
};

const STATUS_NAME_TO_STAGE: Record<string, number> = {
  'shipment received': 0, 'shipment booked': 0, 'pending': 0, 'enquiry collected': 0,
  'shipment forwarded': 1, 'more tracking': 1, 'transfer': 1,
  'shipment arrived': 2, 'waiting for clearance': 2, 'shipment on hold': 2, 'shipment cleared': 2,
  'delivery arranged': 3, 'shipment out for delivery': 3, 'not delivered': 3,
  'delivered': 4,
};

const EXCEPTION_NAMES = new Set(['shipment on hold', 'not delivered']);

function deriveStageFromApi(payload?: TrackResponse) {
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

  return { index: 0, exception, detail };
}

/* --------------------------- Helpers (NEW) ------------------------------- */
const isSixDigitBillNo = (v: string) => /^\d{6}$/.test(v.trim());

const isInvoiceQuery = (v: string) => {
  const s = v.trim();
  // supports "INV-2025-3109", "INV/2025-3109", etc.
  const isInvPattern = /^INV[-/][A-Za-z0-9-]+$/i.test(s);
  return isInvPattern || isSixDigitBillNo(s); // <-- now 6-digit numbers use /tracks
};

const fetchSmart = async (q: string) => {
  const s = q.trim();
  if (isInvoiceQuery(s)) {
    return fetchTrackingByInvoice(s);        // <-- routes 6-digit to /tracks/{xxxxx}
  }
  return fetchTrackingData(s);
};
/* ------------------------- Public Component API ------------------------- */
type TrackingJourneyProps = {
  initialQuery?: string;
  autoFetch?: boolean;
};

const TrackingJourney: React.FC<TrackingJourneyProps> = ({ initialQuery, autoFetch }) => {
  const [mode] = useState<Mode>('tracking');
  const [q, setQ] = useState(initialQuery ?? '');
  const [touched, setTouched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<TrackResponse | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const valid = useMemo(() => {
    if (!touched && q === '') return false;
    return /^[A-Za-z0-9\-/:]{6,}$/i.test(q.trim());// allow "/" for invoice pattern
  }, [q, touched]);

  const stageInfo = useMemo(() => deriveStageFromApi(data || undefined), [data]);
  const currentIndex = data ? stageInfo.index : -1;

  useEffect(() => {
    if (!initialQuery || !autoFetch) return;
    setTouched(true);
    (async () => {
      setErr(null);
      setData(null);
      setLoading(true);
      try {
        const json = await fetchSmart(initialQuery.trim()); // <-- now auto-detects invoice vs tracking
        setData(json);
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : typeof e === 'string' ? e : JSON.stringify(e);
        setErr(msg || 'Failed to fetch');
      } finally {
        setLoading(false);
      }
    })();
  }, [initialQuery, autoFetch]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    if (!valid) return;

    setErr(null);
    setData(null);
    setLoading(true);

    try {
      const json = await fetchSmart(q.trim()); // <-- invoice-aware fetch
      setData(json);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : typeof e === 'string' ? e : JSON.stringify(e);
      setErr(msg || 'Failed to fetch');
    } finally {
      setLoading(false);
    }
  };

  const isInvoice = isInvoiceQuery(q) || !!data?.invoice_no;
  const displayCode = data?.invoice_no || data?.tracking_code || data?.tracking_no || q.trim();
  const method = data?.shipment_method || data?.method;
  const statusText = (data?.status_name || data?.status || '').trim();

  return (
    <section className="tracking-journey-section bg-transparent text-black">
      <div className="max-w-5xl mx-auto px-0 py-0">
        <div className="w-full rounded-2xl border border-neutral-200 bg-white">
          {/* Header */}
          <div className="flex flex-col gap-3 border-b border-neutral-200 p-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="track-form-heading text-xl tracking-tight sm:text-2xl">Track Your Shipment</h1>
              <p className="track-form-sub-heading mt-1 text-xs sm:text-sm text-black">
                Real-time milestone view from booking to delivery.
              </p>
            </div>
            <div className="track-form-status-head flex items-center gap-2 text-xs text-black">
              <div className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" /> Live status
            </div>
          </div>

          {/* Form */}
          <form onSubmit={onSubmit} className="grid gap-4 p-4">
            <div className="flex flex-col gap-3 sm:flex-row">
              <label className="sr-only" htmlFor="track-input">{labelCopy[mode]}</label>
              <input
                id="track-input"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                onBlur={() => setTouched(true)}
                placeholder={placeholders[mode]}
                inputMode="text"
                className="w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 text-base outline-none transition placeholder:text-neutral-500 focus:border-neutral-400 focus:bg-white focus:shadow-[0_0_0_3px_rgba(59,130,246,0.25)]"
              />
              <button type="submit" className="track-form-btn inline-flex items-center gap-2 rounded-xl bg-black text-white px-4 py-3 disabled:opacity-60" disabled={loading}>
                <FiSearch size={16} className="shrink-0" />
                {loading ? ' Checking…' : ' Track'}
              </button>
            </div>

            {touched && !valid && (
              <p className="text-sm text-red-500 track-form-validation">
                Enter a valid tracking number or invoice (min 6 chars).
              </p>
            )}
            {loading && <p className="text-sm text-neutral-600">Checking status…</p>}
            {err && <p className="text-sm text-red-600">{err}</p>}

            {/* Identifiers */}
            {data && (
              <div className="rounded-xl border border-neutral-200 bg-white p-4 text-sm">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2 py-1 rounded bg-yellow-100 text-yellow-900 font-semibold">
                    {displayCode}
                  </span>
              {isInvoice && (
                <span className="px-2 py-1 rounded bg-indigo-100 text-indigo-900">Invoice/Bill</span>
              )}
                  {method && (
                    <span className="px-2 py-1 rounded bg-emerald-100 text-emerald-900">{method}</span>
                  )}
                  {statusText && (
                    <span className="px-2 py-1 rounded bg-neutral-100 text-neutral-900">{statusText}</span>
                  )}
                  <button
                    type="button"
                    className="text-xs px-2 py-1 rounded border bg-gray-50 hover:bg-gray-100"
                    onClick={() => { if (displayCode) navigator.clipboard.writeText(String(displayCode)); }}
                  >
                    Copy
                  </button>
                </div>
              </div>
            )}

            {/* Stages */}
            <div className="mt-1 rounded-2xl border border-neutral-200 bg-neutral-50 p-5">
              <ol className="relative mx-auto sm:flex sm:flex-col sm:w-full lg:grid lg:grid-cols-5 gap-0">
                {STAGES.map((s, i) => {
                  const Icon = s.icon;
                  const reached = i <= currentIndex && currentIndex >= 0;
                  const isCurrent = i === currentIndex && currentIndex >= 0;

                  return (
                    <li key={s.key} className="track-list-flex relative flex sm:flex-col items-center text-center sm:w/full lg:w-auto">
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
          </form>
        </div>
      </div>
    </section>
  );
};

export default TrackingJourney;
