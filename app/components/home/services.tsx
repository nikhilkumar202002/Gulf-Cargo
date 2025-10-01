"use client";
import React from "react";
import { motion } from "framer-motion";
import { servicesData } from "../data/servicesData";
import "./HomeStyles.css";
import Link from "next/link";

const container = {
  hidden: { opacity: 0, y: 12 },
  show: {
    opacity: 1,
    y: 0,
    transition: { when: "beforeChildren", staggerChildren: 0.08, duration: 0.45, ease: "easeOut" },
  },
};

const card = {
  hidden: { opacity: 0, y: 16, scale: 0.98 },
  show:   { opacity: 1, y: 0, scale: 1, transition: { duration: 0.35, ease: "easeOut" } },
};

const Services = () => {
  return (
    <>
      <section className="our-service">
        <div className="our-service-container container">
          <div className="our-service-header">
            <h1>Our Trusted Cargo & Logistics Services</h1>
            <p>
              From domestic to international freight, we deliver reliable, efficient, and customized logistics
              solutions across the GCC.
            </p>
          </div>

          <div className="our-service-wrapper">
            <motion.div
              className="our-service-cards grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
              variants={{container}}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.2 }}
            >
              {servicesData.map((service, index) => (
                <motion.div
                  key={index}
                  className="our-service-card"
                  variants={{card}}
                  whileHover={{ y: -4 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 260, damping: 20 }}
                >
                  <div className="our-service-card-header flex items-center gap-3">
                    <motion.span
                      whileHover={{ scale: 1.06, rotate: 1.5 }}
                      transition={{ type: "spring", stiffness: 300, damping: 16 }}
                    >
                      {service.icon}
                    </motion.span>
                    <h1>{service.title}</h1>
                  </div>
                  <div className="our-service-card-descrption">
                    <p>{service.description}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          <div className="our-service-card-btn">
            <Link className="our-service-card-btn" href="/services" target="_blank" rel="noopener noreferrer">
              View More
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default Services;
