// File: app/components/TrackingJourney.tsx
"use client";
import React, { useMemo, useState } from "react";
import { FiPhone, FiFileText, FiSearch, FiPackage, FiTruck, FiMapPin, FiCheckCircle } from "react-icons/fi";
import { FaBarcode } from "react-icons/fa";
import type { IconType } from "react-icons";
import "./TrackingPageStyles.css";

// ---- Types ----
type Mode = "phone" | "invoice" | "tracking";

// ---- Mocked stages (you can swap with real API later) ----
interface Stage {
    key: "booked" | "in_transit" | "arrival" | "out_for_delivery" | "delivered";
    title: string;
    alt: string;
    icon: IconType;
}
const STAGES: Stage[] = [
    {
        key: "booked",
        title: "Shipment Booked",
        alt: "Received",
        icon: FiPackage,
    },
    {
        key: "in_transit",
        title: "In Transit",
        alt: "Forwarded",
        icon: FiTruck,
    },
    {
        key: "arrival",
        title: "Arrived at Destination",
        alt: "Clearance",
        icon: FiMapPin,
    },
    {
        key: "out_for_delivery",
        title: "Out for Delivery",
        alt: "Last Mile",
        icon: FiTruck,
    },
    {
        key: "delivered",
        title: "Delivered",
        alt: "End Point",
        icon: FiCheckCircle,
    },
] as const;

function simulateTrackProgress(query: string) {
    // Quick deterministic pseudo-progress just for demo
    const digits = query.replace(/\D/g, "");
    const seed = digits ? parseInt(digits.slice(-2)) : query.length * 7;
    const idx = Math.min(STAGES.length - 1, Math.max(0, Math.floor((seed % 100) / 25)));
    const etaDays = Math.max(0, 4 - idx);
    return { currentIndex: idx, etaDays };
}

export default function TrackingJourney() {
    const [mode, setMode] = useState<Mode>("tracking");
    const [q, setQ] = useState("");
    const [touched, setTouched] = useState(false);

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

    const { currentIndex, etaDays } = useMemo(() => simulateTrackProgress(q), [q]);

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

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setTouched(true);
        if (!valid) return;
        // In real app, call your API here with mode+q, then set state with response
    };

    return (
        <section className="min-h-[80dvh] bg-transparent text-black">
            {/* Gradient header */}
            <div className={`heroGradient relative isolate`}></div>

            <div className="container mx-auto px-4 py-10 lg:py-14">
                {/* Card */}
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
                        <div className="inline-flex w-full overflow-hidden rounded-xl border-neutral-200 bg-white p-1">
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
                                    mode === key
                                    ? "bg-[#262262] text-white"
                                    : "text-black hover:bg-neutral-100",
                                ].join(" ")}
                                >
                                <Icon className={"h-4 w-4"} />
                                {text}
                                </button>


                            ))}
                        </div>

                        {/* Input + CTA */}
                        <div className="flex flex-col gap-3 sm:flex-row">
                            <label className="sr-only" htmlFor="track-input">
                                {labelCopy[mode]}
                            </label>
                            <input
                                id="track-input"
                                value={q}
                                onChange={(e) => setQ(e.target.value)}
                                onBlur={() => setTouched(true)}
                                placeholder={placeholders[mode]}
                                inputMode={mode === "phone" ? "tel" : "text"}
                                className="w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 text-base outline-none ring-0 transition placeholder:text-neutral-500 focus:border-neutral-400 focus:bg-white focus:shadow-[0_0_0_3px_rgba(59,130,246,0.25)]"
                            />
                            <button
                                type="submit"
                                className="track-form-btn"
                            >
                                <FiSearch size={16} className="shrink-0" /> Track
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

                        {/* Progress */}
                        <div className="mt-1 rounded-2xl border border-neutral-200 bg-neutral-50 p-5">
                            
                            <div className="hidden lg:block">
                                <ol className="relative mx-auto grid max-w-4xl grid-cols-5 gap-0">
                                    {STAGES.map((s, i) => {
                                        const Icon = s.icon;
                                        const reached = i <= currentIndex && valid;
                                        const isCurrent = i === currentIndex && valid;
                                        return (
                                            <li key={s.key} className="relative flex flex-col items-center text-center">
                                                {/* Connector */}
                                                {i !== 0 && (
                                                    <div
                                                        className={[
                                                            "absolute left-0 right-0 top-4 h-1",
                                                            i <= currentIndex ? "progressBarActive" : "progressBar",
                                                        ].join(" ")}
                                                    />
                                                )}
                                                {/* Node */}
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

                            {/* Mobile vertical timeline */}
                            <div className="lg:hidden">
                                <ol className="relative ms-3 border-s border-neutral-200">
                                    {STAGES.map((s, i) => {
                                        const Icon = s.icon;
                                        const reached = i <= currentIndex && valid;
                                        const isCurrent = i === currentIndex && valid;
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
                                    {valid ? (
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
                                        <span className="text-black track-form-mode-heading">Enter a valid query to see live ETA.</span>
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
