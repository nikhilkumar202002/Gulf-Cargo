"use client"

import React, { useState } from 'react';
import { IoIosArrowDown } from "react-icons/io";
import { motion, AnimatePresence } from "framer-motion";
import "./TrackingPageStyles.css";

const Faq = () => {

  const [activeIndex, setActiveIndex] = useState<number | null>(0);

  const toggleAccordion = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const faqData = [
    {
      question: "What items can I ship through your cargo services?",
      answer: "We handle a wide range of shipments including personal items, household goods, commercial products, documents, machinery, electronics, perishables, and more. Restricted or prohibited items depend on the destination country’s regulations."
    },
    {
      question: "How long does delivery take for GCC door delivery?",
      answer: "Delivery across GCC countries typically takes 2–7 working days, depending on the destination, customs clearance, and cargo type. Express options are available for urgent shipments."
    },
    {
      question: "Do you offer packing services for fragile items?",
      answer: "Yes. Our team provides professional packing using high-quality materials such as bubble wrap, foam, wooden crates, and shock-proof packaging to ensure maximum safety for fragile and valuable items."
    },
    {
      question: "How can I track my shipment?",
      answer: "You can track your shipment through our online tracking system using your tracking number or airway bill (AWB). We also provide status updates through SMS or WhatsApp upon request."
    },
    {
      question: "What documents are required for international shipping?",
      answer: "Common documents include a valid ID, packing list, invoice (for commercial shipments), and any required permits or certificates. Our customs team assists with all documentation and clearance to make the process easy."
    },
    {
      question: "Do you provide door-to-door pickup and delivery services?",
      answer: "Yes, we offer complete door-to-door services. Our team will pick up the shipment from your location, manage packing, documentation, customs clearance, and deliver it safely to the final address."
    }
  ];

  return (
    <>
      <section className="tracking-faq">
        <div className="tracking-faq-container">
          <div className="tracking-faq-accordian">
            {faqData.map((item, index) => {
              const isOpen = activeIndex === index;

              return (
                <div
                  key={index}
                  className={`tracking-faq-accordian-items ${isOpen ? 'active' : ''}`}
                >
                  <div
                    className="tracking-faq-accordian-header"
                    onClick={() => toggleAccordion(index)}
                    style={{ cursor: 'pointer' }}
                  >
                    <h3>{item.question}</h3>
                    
                    {/* Animated Arrow */}
                    <motion.span
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      style={{ display: 'flex', alignItems: 'center' }}
                    >
                      <IoIosArrowDown />
                    </motion.span>
                  </div>

                  {/* Animated Content Height */}
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        style={{ overflow: "hidden" }}
                      >
                        <div className="tracking-faq-accordian-content">
                          <p>{item.answer}</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  )
}

export default Faq