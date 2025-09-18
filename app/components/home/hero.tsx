'use client'

import { Button } from '@radix-ui/themes'
import React from 'react'
import { motion } from 'framer-motion' // Import framer-motion
import "./HomeStyles.css";
import TrackingForm from '../tracking/TrackingForm';

const hero = () => {
  return (
    <>
      <section className="hero">
        <motion.div
          className="hero-container container relative bg-[url('/Banners/main-banner-1.webp')] bg-cover bg-center bg-no-repeat"
          initial={{ opacity: 0 }} // Start with invisible
          animate={{ opacity: 1 }} // Fade in
          transition={{ duration: 1 }} // Fade in duration
        >
          <motion.div
            className="hero-content-flex container-small flex items-center"
            initial={{ opacity: 0 }} // Start invisible
            animate={{ opacity: 1 }} // Fade in
            transition={{ duration: 1, delay: 0.2 }} // Add delay for smooth fade-in
          >
            <div className="hero-content">
              <motion.h1
                className="hero-content-heading"
                initial={{ y: -50, opacity: 0 }} // Start above and invisible
                animate={{ y: 0, opacity: 1 }} // Slide in and fade in
                transition={{ duration: 1, delay: 0.4 }} // Delay for smoothness
              >
                GULF CARGO LLC
              </motion.h1>
              <motion.p
                className="hero-content-description"
                initial={{ y: -50, opacity: 0 }} // Start above and invisible
                animate={{ y: 0, opacity: 1 }} // Slide in and fade in
                transition={{ duration: 1, delay: 0.6 }} // Delay for smoothness
              >
                Provides full service of Air/Sea/Land - Import & Export Customs Clearance, International Freight Forwarding and all types of Cargo Packing based on our long field experience. We globally support all logistics requirements.
              </motion.p>
              <motion.div
                className="hero-content-btns flex gap-3"
                initial={{ y: 20, opacity: 0 }} // Start below and invisible
                animate={{ y: 0, opacity: 1 }} // Slide in and fade in
                transition={{ duration: 1, delay: 0.8 }} // Delay for smoothness
              >
                <Button>Our Services</Button>
                <Button className="hero-content-btn-2">More Info</Button>
              </motion.div>
            </div>

            <motion.div
              className="hero-tracking-form"
              initial={{ opacity: 0 }} // Start invisible
              animate={{ opacity: 1 }} // Fade in
              transition={{ duration: 1, delay: 1 }} // Delay to fade in last
            >
              <TrackingForm />
            </motion.div>
          </motion.div>
        </motion.div>
      </section>
    </>
  )
}

export default hero
