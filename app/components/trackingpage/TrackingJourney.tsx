"use client";

import React, { useMemo, useState } from "react";
import {
  FiPhone,
  FiFileText,
  FiSearch,
  FiPackage,
  FiTruck,
  FiMapPin,
  FiCheckCircle,
} from "react-icons/fi";
import { FaBarcode } from "react-icons/fa";
import type { IconType } from "react-icons";
import "./TrackingPageStyles.css";

/* ------------------------------- Types ---------------------------------- */
type Mode = "phone" | "invoice" | "tracking";

interface Stage {
  key: "booked" | "in_transit" | "arrival" | "out_for_delivery" | "delivered";
  title: string;
  alt: string;
  icon: IconType;
}

type TrackResponse = {
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
  [k: string]: unknown;   // <- was: any
};

/* ----------------------------- UI Constants ----------------------------- */
const STAGES: Stage[] = [
  { key: "booked",          title: "Shipment Booked",        alt: "Received/Pending",   icon: FiPackage },
  { key: "in_transit",      title: "In Transit",             alt: "Forwarded/Transfer", icon: FiTruck   },
  { key: "arrival",         title: "Arrival & Clearance",    alt: "Arrived/Clearing",   icon: FiMapPin  },
  { key: "out_for_delivery",title: "Out for Delivery",       alt: "Delivery Arranged",  icon: FiTruck   },
  { key: "delivered",       title: "Delivered",              alt: "Complete",           icon: FiCheckCircle },
] as const;

const placeholders: Record<Mode, string> = {
  phone: "Enter phone number (e.g. +91 98765 43210)",
  invoice: "Enter invoice number",
  tracking: "Enter tracking number",
};

const labelCopy: Record<Mode, string> = {
  phone: "Track by Phone Number",
  invoice: "Track by Invoice Number",
  tracking: "Track by Tracking Number",
};

/* ------------------------ Status → Major Stage Map ---------------------- */
/** Map by numeric IDs (from your list). */
const STATUS_ID_TO_STAGE: Record<number, number> = {
  // 0 — Booked / Received / Pending / Enquiry
  1: 0,  // Shipment received
  2: 0,  // Shipment booked
  11: 0, // Pending
  13: 0, // Enquiry collected

  // 1 — In transit / Forwarded / Transfer / More tracking
  3: 1,  // Shipment forwarded
  12: 1, // More Tracking
  14: 1, // Transfer

  // 2 — Arrival & Clearance (arrived/clearance/on hold)
  4: 2,  // Shipment arrived
  5: 2,  // Waiting for clearance
  6: 2,  // Shipment on hold (exception)
  7: 2,  // Shipment cleared

  // 3 — Last-mile
  8: 3,  // Delivery arranged
  9: 3,  // Shipment out for delivery
  10: 3, // Not Delivered (exception/failed last-mile)
  // 4 — Delivered: if you add a Delivered status id in future, map it to 4
};

/** Map by names (fallback if no status_id). */
const STATUS_NAME_TO_STAGE: Record<string, number> = {
  "shipment received": 0,
  "shipment booked": 0,
  "pending": 0,
  "enquiry collected": 0,

  "shipment forwarded": 1,
  "more tracking": 1,
  "transfer": 1,

  "shipment arrived": 2,
  "waiting for clearance": 2,
  "shipment on hold": 2,
  "shipment cleared": 2,

  "delivery arranged": 3,
  "shipment out for delivery": 3,
  "not delivered": 3,

  // if backend ever returns "delivered"
  "delivered": 4,
};

/** Statuses that should show a caution badge. */
const EXCEPTION_NAMES = new Set([
  "shipment on hold",
  "not delivered",
]);

/* ---------------------------- Data Functions ---------------------------- */
async function fetchTracking(code: string) {
  const res = await fetch(
    `https://api.gulfcargoksa.com/public/api/shipment/track/${encodeURIComponent(code)}`,
    { cache: "no-store" }
  );
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    try {
      const j = text ? JSON.parse(text) : {};
      throw new Error(j?.error || j?.message || `Failed (${res.status})`);
    } catch {
      throw new Error(text || `Failed (${res.status})`);
    }
  }
  return res.json();
}


/** Returns major stage index (0..4) + flags based on API status. */
function deriveStageFromApi(payload?: TrackResponse) {
  const detail = (payload?.status_name || payload?.status || "").trim(); // <- const
  let exception = false;

  // 1) Prefer ID mapping if present
  if (typeof payload?.status_id === "number") {
    const idx = STATUS_ID_TO_STAGE[payload.status_id];
    if (idx !== undefined) {
      // determine exception via name if we have it
      if (detail && EXCEPTION_NAMES.has(detail.toLowerCase())) exception = true;
      return { index: idx, exception, detail };
    }
  }

  // 2) Fallback: name mapping
  const key = detail.toLowerCase();
  if (STATUS_NAME_TO_STAGE[key] !== undefined) {
    if (EXCEPTION_NAMES.has(key)) exception = true;
    return { index: STATUS_NAME_TO_STAGE[key], exception, detail };
  }

  // 3) Last-chance heuristics for unexpected strings
  if (/deliver/i.test(detail)) return { index: /not/i.test(detail) ? 3 : 4, exception, detail };
  if (/out/i.test(detail))     return { index: 3, exception, detail };
  if (/arriv|dest|clear/i.test(detail)) return { index: 2, exception, detail };
  if (/transit|forward|transfer/i.test(detail)) return { index: 1, exception, detail };
  if (/book|receiv|enquiry|pending/i.test(detail)) return { index: 0, exception, detail };

  // Unknown → safest is stage 0 (booked/pending)
  return { index: 0, exception, detail };
}

/* --------------------------------- UI ----------------------------------- */
export default function TrackingJourney() {
  const [mode, setMode] = useState<Mode>("tracking");
  const [q, setQ] = useState("");
  const [touched, setTouched] = useState(false);

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<TrackResponse | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const valid = useMemo(() => {
    if (!touched && q === "") return false;
    switch (mode) {
      case "phone":
        return /^\+?[0-9\s-]{6,18}$/.test(q.trim());
      case "invoice":
        return /^[A-Za-z0-9-]{4,}$/.test(q.trim());
      case "tracking":
        return /^[A-Za-z0-9-]{6,}$/.test(q.trim());
      default:
        return false;
    }
  }, [mode, q, touched]);

  const stageInfo = useMemo(() => deriveStageFromApi(data || undefined), [data]);
  const currentIndex = data ? stageInfo.index : -1;
  const etaDays = useMemo(() => (currentIndex >= 0 ? Math.max(0, 4 - currentIndex) : 0), [currentIndex]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    if (!valid) return;

    if (mode !== "tracking") {
      setErr("Use tracking number for now.");
      return;
    }

    setErr(null);
    setData(null);
    setLoading(true);

    try {
      const json = await fetchTracking(q.trim());
      setData(json);
} catch (e: unknown) {
  const msg = e instanceof Error ? e.message : typeof e === "string" ? e : JSON.stringify(e);
  setErr(msg || "Failed to fetch");
} finally {
  setLoading(false);
}

  }

  return (
    <section className="min-h-[80dvh] bg-transparent text-black">
      <div className="heroGradient relative isolate"></div>

      <div className="container mx-auto px-4 py-10 lg:py-14">
        <div className="mx-auto w-full max-w-5xl rounded-3xl border border-neutral-200 bg-white">
          {/* Header */}
          <div className="flex flex-col gap-3 border-b border-neutral-200 p-6 sm:flex-row sm:items-end sm:justify-between lg:p-8">
            <div>
              <h1 className="track-form-heading text-2xl tracking-tight sm:text-3xl">Track Your Shipment</h1>
              <p className="track-form-sub-heading mt-1 text-sm text-black">Real-time milestone view from booking to delivery.</p>
            </div>
            <div className="track-form-status-head flex items-center gap-2 text-xs text-black">
              <div className="h-2 w-2 animate-pulse rounded-full bg-emerald-400"></div>
              Live status
            </div>
          </div>

          {/* Form */}
          <form onSubmit={onSubmit} className="grid gap-5 p-6 lg:p-8">
            {/* Mode switch */}
            <div className="inline-flex w-full overflow-hidden rounded-xl bg-white p-1 border-neutral-200">
              {[
                { key: "phone", Icon: FiPhone, text: "Phone" },
                { key: "invoice", Icon: FiFileText, text: "Invoice" },
                { key: "tracking", Icon: FaBarcode, text: "Tracking" },
              ].map(({ key, Icon, text }) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setMode(key as Mode)}
                  className={[
                    "track-form-tab-form",
                    "rounded-lg",
                    mode === key ? "bg-[#262262] text-white" : "text-black hover:bg-neutral-100",
                  ].join(" ")}
                >
                  <Icon className={"h-4 w-4"} />
                  {text}
                </button>
              ))}
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <label className="sr-only" htmlFor="track-input">{labelCopy[mode]}</label>
              <input
                id="track-input"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                onBlur={() => setTouched(true)}
                placeholder={placeholders[mode]}
                inputMode={mode === "phone" ? "tel" : "text"}
                className="w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 text-base outline-none transition placeholder:text-neutral-500 focus:border-neutral-400 focus:bg-white focus:shadow-[0_0_0_3px_rgba(59,130,246,0.25)]"
              />
              <button type="submit" className="track-form-btn" disabled={loading}>
                <FiSearch size={16} className="shrink-0" />
                {loading ? " Checking…" : " Track"}
              </button>
            </div>

            {/* Validation */}
            {touched && !valid && (
              <p className="text-sm text-red-400 track-form-validation">
                {mode === "phone"
                  ? "Enter a valid phone number (6–18 digits)."
                  : mode === "invoice"
                  ? "Enter a valid invoice number (min 4 chars)."
                  : "Enter a valid tracking number (min 6 chars)."}
              </p>
            )}

        {/* Live summary / errors */}
{loading && <p className="text-sm text-neutral-600">Checking status…</p>}
{err && <p className="text-sm text-red-600">{err}</p>}

{data && (
  <div className="rounded-xl border border-neutral-200 bg-white p-4 text-sm">
    <div className="flex flex-wrap items-center gap-2">
      {/* Remove the label if you want literally just the pill */}
      {/* <span className="text-neutral-500">Tracking:</span> */}
      <span className="px-2 py-1 rounded bg-yellow-100 text-yellow-900 font-semibold">
        {data.tracking_code || data.tracking_no || q.trim()}
      </span>
      <button
        type="button"
        className="text-xs px-2 py-1 rounded border bg-gray-50 hover:bg-gray-100"
        onClick={() => {
          const t = data.tracking_code || data.tracking_no || q.trim();
          if (t) navigator.clipboard.writeText(t);
        }}
      >
        Copy
      </button>
    </div>
  </div>
)}


            {/* Progress */}
            <div className="mt-1 rounded-2xl border border-neutral-200 bg-neutral-50 p-5">
              {/* Desktop horizontal */}
              <div className="hidden lg:block">
                <ol className="relative mx-auto grid max-w-4xl grid-cols-5 gap-0">
                  {STAGES.map((s, i) => {
                    const Icon = s.icon;
                    const reached = i <= currentIndex && currentIndex >= 0;
                    const isCurrent = i === currentIndex && currentIndex >= 0;
                    return (
                      <li key={s.key} className="relative flex flex-col items-center text-center">
                        {i !== 0 && (
                          <div
                            className={[
                              "absolute left-0 right-0 top-4 h-1",
                              i <= currentIndex && currentIndex >= 0
                                ? "progressBarActive"
                                : "progressBar",
                            ].join(" ")}
                          />
                        )}
                        <div className="relative z-10 flex h-8 w-8 items-center justify-center">
                          <div
                            className={[
                              "absolute inset-0 rounded-full",
                              reached ? "nodeGlow" : "bg-neutral-200",
                            ].join(" ")}
                          />
                          <Icon size={20} className={reached ? "text-black" : "text-neutral-400"} />
                        </div>
                        <div className="track-form-data-heading mt-3 text-xs font-medium text-black">{s.title}</div>
                        <div className="track-form-data-sub-heading text-[10px] text-neutral-500">{s.alt}</div>
                        {isCurrent && (
                          <div className="mt-2 rounded-full bg-emerald-500/10 px-3 py-1 text-[10px] font-semibold text-emerald-300">
                            In progress
                          </div>
                        )}
                      </li>
                    );
                  })}
                </ol>
              </div>

              {/* Mobile vertical */}
              <div className="lg:hidden">
                <ol className="relative ms-3 border-s border-neutral-200">
                  {STAGES.map((s, i) => {
                    const Icon = s.icon;
                    const reached = i <= currentIndex && currentIndex >= 0;
                    const isCurrent = i === currentIndex && currentIndex >= 0;
                    return (
                      <li key={s.key} className="mb-6 ms-6">
                        <span
                          className={[
                            "absolute -start-3.5 flex h-7 w-7 items-center justify-center rounded-full border",
                            reached ? "border-emerald-400 bg-emerald-500/20" : "border-neutral-200 bg-neutral-100",
                          ].join(" ")}
                        >
                          <Icon size={16} className={reached ? "text-emerald-300" : "text-neutral-500"} />
                        </span>
                        <h3 className="text-sm font-semibold leading-tight">{s.title}</h3>
                        <p className="text-xs text-black">{s.alt}</p>
                        {isCurrent && (
                          <div className="mt-1 text-[10px] font-semibold text-emerald-300">In progress</div>
                        )}
                      </li>
                    );
                  })}
                </ol>
              </div>

              {/* ETA & Meta */}
              <div className="mt-4 flex flex-col justify-between gap-3 rounded-xl bg-neutral-50 p-4 sm:flex-row sm:items-center">
                <div className="text-sm text-black track-form-mode-heading">
                  <span className="track-form-mode-heading text-black">Mode:</span> {labelCopy[mode]}
                </div>
                <div className="text-sm">
                  {currentIndex >= 0 ? (
                    <>
                      {currentIndex < STAGES.length - 1 ? (
                        <span className="text-white/80 track-form-mode-heading">Est. delivery in </span>
                      ) : (
                        <span className="text-emerald-300 track-form-mode-heading">Delivered</span>
                      )}
                      {currentIndex < STAGES.length - 1 && (
                        <span className="font-semibold text-black">{etaDays} day{etaDays === 1 ? "" : "s"}</span>
                      )}
                    </>
                  ) : (
                    <span className="text-black track-form-mode-heading">Enter a valid code to see live ETA.</span>
                  )}
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
