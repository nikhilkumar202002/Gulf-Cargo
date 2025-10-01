"use client";

import React from 'react'
import { motion } from "framer-motion";
import { heroFeaturesData } from "../data/heroFeaturesData";

const container = {
  hidden: { opacity: 0, y: 12 },
  show: {
    opacity: 1, y: 0,
    transition: { duration: 0.45, ease: "easeOut", when: "beforeChildren", staggerChildren: 0.08 }
  }
};

const item = {
  hidden: { opacity: 0, y: 14 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } }
};

const herosecond = () => {
    return (
        <>
             <section className="hero-second">
        <motion.div
          className="hero-second-container container"
          variants={{container}}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
        >
          <div className="hero-second-row grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {heroFeaturesData.map((feature, index) => (
              <motion.div className="hero-second-col" key={index} variants={{item}}>
                <motion.div
                  className="hero-second-items flex items-start gap-2"
                  whileHover={{ y: -4 }}
                  transition={{ type: "spring", stiffness: 300, damping: 22 }}
                >
                  <motion.div
                    className="hero-second-icon"
                    whileHover={{ scale: 1.06, rotate: 1.5 }}
                    transition={{ type: "spring", stiffness: 260, damping: 18 }}
                  >
                    {feature.icon}
                  </motion.div>

                  <div className="hero-second-content">
                    <h1>{feature.title}</h1>
                    <p>{feature.description}</p>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>
        </>
    )
}

export default herosecond