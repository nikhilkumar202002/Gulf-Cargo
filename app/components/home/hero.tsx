'use client'

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { IoArrowForward, IoChevronBack, IoChevronForward } from 'react-icons/io5';
import TrackingForm from '../tracking/TrackingForm';
import './HomeStyles.css';

type Slide = {
  id: number;
  image: string;              // e.g. "/Banners/main-banner-1.webp"
  heading: string;            // big title
  description: string;        // paragraph
  primary: { label: string; href: string };
  secondary?: { label: string; href: string };
};

const SLIDES: Slide[] = [
  {
    id: 1,
    image: "./Banners/main-banner-1.webp",
    heading: "GULF CARGO LLC",
    description:
      "Provides full service of Air/Sea/Land - Import & Export Customs Clearance, International Freight Forwarding and all types of Cargo Packing based on our long field experience. We globally support all logistics requirements.",
    primary: { label: "Our Services", href: "/services" },
    secondary: { label: "More Info", href: "/company" },
  },
  {
    id: 2,
    image: "./Banners/main-banner-2.webp",
    heading: "Air • Sea • Land",
    description:
      "Door-to-door solutions with real-time tracking and customs support across major trade lanes.",
    primary: { label: "Track a Shipment", href: "/tracking" },
    secondary: { label: "Coverage Map", href: "/coverage" },
  },
  {
    id: 3,
    image: "./Banners/main-banner-3.webp",
    heading: "Pack • Clear • Deliver",
    description:
      "Professional packing, bonded warehousing, and last-mile delivery tailored to your cargo.",
    primary: { label: "Request a Quote", href: "/quote" },
    secondary: { label: "Compliance & Docs", href: "/docs" },
  },
];

const TRANSITION = { duration: 0.6, ease: [0.22, 1, 0.36, 1] };

const Hero: React.FC = () => {

  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const total = SLIDES.length;
  const current = SLIDES[index];

   const startAutoplay = useCallback(() => {
    stopAutoplay();
    timerRef.current = setInterval(() => {
      setDirection(1);
      setIndex((i) => (i + 1) % total);
    }, 6000);
  }, [total]);

  const stopAutoplay = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
  }, []);

  useEffect(() => {
    startAutoplay();
    return stopAutoplay;
  }, [startAutoplay, stopAutoplay]);

  // Keyboard nav
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') goNext();
      if (e.key === 'ArrowLeft') goPrev();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const goNext = useCallback(() => {
    setDirection(1);
    setIndex((i) => (i + 1) % total);
    startAutoplay();
  }, [total, startAutoplay]);

  const goPrev = useCallback(() => {
    setDirection(-1);
    setIndex((i) => (i - 1 + total) % total);
    startAutoplay();
  }, [total, startAutoplay]);

  // For swipe gesture threshold
  const SWIPE_CONFIDENCE = 80;

  const variants = useMemo(
    () => ({
      enter: (dir: 1 | -1) => ({
        x: dir > 0 ? 60 : -60,
        opacity: 0,
      }),
      center: { x: 0, opacity: 1 },
      exit: (dir: 1 | -1) => ({
        x: dir > 0 ? -60 : 60,
        opacity: 0,
      }),
    }),
    []
  );

  return (
    <>
      <section className="hero">
      <div className="hero-container container relative">
        {/* Background image layer per slide */}
        <div className="hero-bg-layer">
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={current.id}
              className="hero-bg"
              style={{ backgroundImage: `url('${current.image}')` }}
              custom={direction}
              initial="enter"
              animate="center"
              exit="exit"
              variants={variants}
              transition={TRANSITION}
            />
          </AnimatePresence>
          <div className="hero-bg-overlay" />
        </div>

        {/* Content + form */}
        <motion.div
          className="hero-content-flex container-small flex items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          {/* Slide content block (changes per slide) */}
          <AnimatePresence mode="wait" initial={false} custom={direction}>
            <motion.div
              key={`content-${current.id}`}
              className="hero-content"
              custom={direction}
              initial={{ y: -30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 30, opacity: 0 }}
              transition={TRANSITION}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              onDragEnd={(_, info) => {
                const offset = info.offset.x;
                if (offset < -SWIPE_CONFIDENCE) goNext();
                if (offset > SWIPE_CONFIDENCE) goPrev();
              }}
            >
              <motion.h1
                className="hero-content-heading"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ...TRANSITION, delay: 0.1 }}
              >
                {current.heading}
              </motion.h1>

              <motion.p
                className="hero-content-description"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ...TRANSITION, delay: 0.2 }}
              >
                {current.description}
              </motion.p>

              <motion.div
                className="hero-content-btns flex gap-3"
                initial={{ y: 15, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ ...TRANSITION, delay: 0.3 }}
              >
                <Link href={current.primary.href} className="flex items-center gap-2">
                  {current.primary.label} <IoArrowForward />
                </Link>
                {current.secondary && (
                  <Link href={current.secondary.href} className="hero-content-btn-2 flex items-center gap-2">
                    {current.secondary.label} <IoArrowForward />
                  </Link>
                )}
              </motion.div>
            </motion.div>
          </AnimatePresence>

          {/* Tracking form (stays visible across slides) */}
          <motion.div
            className="hero-tracking-form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
          >
            <TrackingForm />
          </motion.div>
        </motion.div>

        {/* Controls */}
        <div className="hero-controls">
          <button
            aria-label="Previous slide"
            className="hero-arrow hero-arrow--left"
            onClick={goPrev}
            onMouseEnter={stopAutoplay}
            onMouseLeave={startAutoplay}
          >
            <IoChevronBack size={22} />
          </button>
          <button
            aria-label="Next slide"
            className="hero-arrow hero-arrow--right"
            onClick={goNext}
            onMouseEnter={stopAutoplay}
            onMouseLeave={startAutoplay}
          >
            <IoChevronForward size={22} />
          </button>

          <div className="hero-dots" onMouseEnter={stopAutoplay} onMouseLeave={startAutoplay}>
            {SLIDES.map((s, i) => (
              <button
                key={s.id}
                aria-label={`Go to slide ${i + 1}`}
                className={`hero-dot ${i === index ? 'is-active' : ''}`}
                onClick={() => {
                  setDirection(i > index ? 1 : -1);
                  setIndex(i);
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
    </>
  )
}

export default Hero
