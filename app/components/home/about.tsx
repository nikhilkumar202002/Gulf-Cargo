"use client";
import React from "react";
import { Button } from "@radix-ui/themes";
import { motion } from "framer-motion";
import "./HomeStyles.css";

const section = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
};

const row = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12, when: "beforeChildren" },
  },
};

const col = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

const text = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
};

const counter = {
  hidden: { opacity: 0, scale: 0.96, y: 10 },
  show: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
};

const about = () => {
  return (
    <>
      <motion.section
        className="about-section"
        variants={section}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
      >
        <div className="about-container container">
          <motion.div
            className="about-row grid grid-cols-1 md:grid-cols-2 gap-20 items-center"
            variants={row}
          >
            {/* Left: Video */}
            <motion.div className="about-col w-full" variants={col}>
              <motion.div
                className="about-video"
                initial={{ opacity: 0, scale: 0.985 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              >
                <video
                  src="/videos/gulf-cargo-about-video.mp4"
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-auto bg-cover"
                />
              </motion.div>
            </motion.div>

            {/* Right: Content */}
            <motion.div className="about-col max-w-xl mx-auto" variants={col}>
              <div className="about-content max-w-xl">
                <motion.h1 className="about-content-heading" variants={text}>
                  About Gulf Cargo
                </motion.h1>

                <motion.p className="about-content-description" variants={text}>
                  With over 13 years of trusted service, Gulf Cargo is a leading cargo and logistics company in the GCC,
                  specializing in point-to-point domestic and international freight. We provide customized logistics and
                  supply chain solutions that ensure your shipments are delivered safely, on time, and with care. Whether
                  by air, sea, or road, our dedicated team works 7 days a week to meet your business needs.
                </motion.p>

                {/* Counters */}
                <motion.div
                  className="about-content-counters grid grid-cols-2 gap-5 mt-8 text-center"
                  variants={row}
                >
                  <motion.div className="about-content-counter" variants={counter}>
                    <h1 className="about-counter-number">13+</h1>
                    <h4 className="about-counter-heading">Years of Experience</h4>
                  </motion.div>

                  <motion.div className="about-content-counter" variants={counter}>
                    <h1 className="about-counter-number">500K+</h1>
                    <h4 className="about-counter-heading">Shipments Delivered</h4>
                  </motion.div>

                  <motion.div className="about-content-counter" variants={counter}>
                    <h1 className="about-counter-number">120+</h1>
                    <h4 className="about-counter-heading">Destinations Covered</h4>
                  </motion.div>

                  <motion.div className="about-content-counter" variants={counter}>
                    <h1 className="about-counter-number">1M+</h1>
                    <h4 className="about-counter-heading">Happy Customers</h4>
                  </motion.div>
                </motion.div>

                {/* CTA */}
                <motion.div
                  className="about-cta"
                  variants={text}
                  whileHover={{ y: -2 }}
                  transition={{ type: "spring", stiffness: 250, damping: 18 }}
                >
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button>More About Gulf Cargo</Button>
                  </motion.div>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>
    </>
  );
};

export default about;
