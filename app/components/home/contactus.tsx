"use client";

import React from 'react';
import { FaLocationDot } from "react-icons/fa6";
import { MdPhoneCallback } from "react-icons/md";
import { IoMailUnreadSharp } from "react-icons/io5";
import { PiClockCountdownFill } from "react-icons/pi";
import { Button } from '@radix-ui/themes';
import { motion, Variants, cubicBezier } from "framer-motion";
import Link from 'next/link';

const EASE_OUT = cubicBezier(0.16, 1, 0.3, 1);
const EASE_STD = cubicBezier(0.2, 0.65, 0.3, 0.9);

const staggerParent: Variants = {
  hidden: {},
  show: {
    transition: { when: "beforeChildren", staggerChildren: 0.1 },
  },
};

// Children animations
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.45, ease: EASE_OUT } },
};

const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show:   { opacity: 1, transition: { duration: 0.35, ease: EASE_STD } },
};

function ContactUs() {
  return (
    <motion.section
      className="contact-section"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
    >
      <div className="contact-container container">
        <motion.div
          className="contact-row grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 xl:gap-16"
          variants={staggerParent}
        >
          <motion.div className="contact-col" variants={fadeUp}>
            <div className="contact-content">
              <motion.h1 className='contact-heading' variants={fadeIn}>
                Get in <span className='contact-hightlight'>Touch</span> With <span className='contact-hightlight'>Gulf</span> Cargo.
              </motion.h1>
              <motion.p className='contact-description' variants={fadeIn}>
                We’re here to help with all your cargo and logistics needs — from inquiries to bookings.
              </motion.p>
            </div>

            <motion.div className="contact-icon-list mt-4 space-y-3" variants={staggerParent}>
              <motion.div variants={fadeUp} whileHover={{ x: 4 }}>
                <Link className='flex items-center gap-4' href="https://www.google.com/maps/dir//Al+Oud,+Hamad+Ibn+Laaboun,+2912,+Al+Oud,+Riyadh+12665,+Riyadh+12211,+Saudi+Arabia/@24.6196126,46.6436924,12z/data=!4m8!4m7!1m0!1m5!1m1!1s0x3e2fa721c5182035:0x6735d5d86726830a!2m2!1d46.726094!2d24.619635?entry=ttu&g_ep=EgoyMDI1MTAwMS4wIKXMDSoASAFQAw%3D%3D">
                <span className='contact-icons'><FaLocationDot/></span>
                <h4 className='contact-lists'>Gulf Cargo LLC, KSA</h4>
                </Link>
                
              </motion.div>

              <motion.div className="flex items-center gap-4 py-3" variants={fadeUp} whileHover={{ x: 4 }}>
                <span className='contact-icons'><MdPhoneCallback/></span>
               <Link href="tel:+966547619393"><h4 className='contact-lists'>+966 54 761 9393</h4></Link> 
              </motion.div>

              <motion.div className="flex items-center gap-4" variants={fadeUp} whileHover={{ x: 4 }}>
                <span className='contact-icons'><IoMailUnreadSharp/></span>
                <Link href="mailto:info@gulfcargoksa.com"><h4 className='contact-lists'>info@gulfcargoksa.com</h4></Link>
              </motion.div>

              <motion.div className="flex items-center gap-4 py-3" variants={fadeUp} whileHover={{ x: 4 }}>
                <span className='contact-icons'><PiClockCountdownFill/></span>
                <h4 className='contact-lists'>Sunday – Saturday, 24/7 Service</h4>
              </motion.div>
            </motion.div>
          </motion.div>

          <motion.div className="contact-col" variants={fadeUp}>
            <motion.div className="contact-form" variants={fadeIn}>
              <form action="">
                <div className="contact-form-row">
                  <label htmlFor="fullName">Full Name</label><br />
                  <motion.input
                    id="fullName"
                    type="text"
                    placeholder="Adam John"
                    whileFocus={{ scale: 1.01, boxShadow: '0 0 0 4px rgba(13,148,136,0.15)' }}
                  />
                </div>

                <div className="contact-form-row margin-top">
                  <label htmlFor="email">Email</label><br />
                  <motion.input
                    id="email"
                    type="email"
                    placeholder="adamjohn@gmail.com"
                    whileFocus={{ scale: 1.01, boxShadow: '0 0 0 4px rgba(13,148,136,0.15)' }}
                  />
                </div>

                <div className="contact-form-row margin-top">
                  <label htmlFor="phone">Phone Number</label><br />
                  <motion.input
                    id="phone"
                    type="tel"
                    placeholder="+971 50 123 4567"
                    whileFocus={{ scale: 1.01, boxShadow: '0 0 0 4px rgba(13,148,136,0.15)' }}
                  />
                </div>

                <div className="contact-form-row margin-top">
                  <label htmlFor="message">Message</label><br />
                  <motion.textarea
                    id="message"
                    rows={5}
                    placeholder="I would like to get a quote for shipping from Dubai to Riyadh."
                    whileFocus={{ scale: 1.01, boxShadow: '0 0 0 4px rgba(13,148,136,0.15)' }}
                  />
                </div>

                <motion.div
                  className="contact-form-row mt-4 inline-block"
                  variants={fadeUp}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button>Send Message</Button>
                </motion.div>
              </form>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  );
}

export default ContactUs;
