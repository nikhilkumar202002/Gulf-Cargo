'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IoClose } from "react-icons/io5";
import Link from 'next/link';

const HomePopup = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // We removed the sessionStorage check so it runs on every reload
    const timer = setTimeout(() => {
      setShow(true);
    }, 5000); // 5 Seconds delay

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setShow(false);
  };

  return (
    <AnimatePresence>
      {show && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/50 z-[9998] backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
          />

          {/* Popup Card */}
          <motion.div
            className="fixed inset-0 flex items-center justify-center z-[9999] p-4 pointer-events-none"
          >
            <motion.div
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden relative pointer-events-auto"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
            >
              {/* Close Button */}
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 text-gray-400 hover:text-[#ED2624] transition-colors p-1 z-20"
              >
                <IoClose size={24} />
              </button>

              {/* Header Image Section */}
              <div className="h-32 bg-[#262262] flex items-center justify-center relative overflow-hidden">
                <div className="absolute -top-10 -left-10 w-32 h-32 bg-white/10 rounded-full" />
                <div className="absolute bottom-5 right-10 w-20 h-20 bg-[#ED2624]/20 rounded-full" />
                <h2 className="text-white text-3xl font-bold z-10 font-['Dm_Sans']">Gulf Cargo</h2>
              </div>

              {/* Content Section */}
              <div className="p-8 text-center">
                <h3 className="text-2xl font-bold text-[#1e1e1e] font-['Dm_Sans'] mb-3">
                  Need a Quick Quote?
                </h3>
                <p className="text-gray-600 mb-6 font-['Inter'] leading-relaxed">
                  Get the best rates for Air, Sea, and Land freight. 
                  Our team is ready to assist you 24/7.
                </p>

                <div className="flex flex-col gap-3">
                  <Link href="/support" onClick={handleClose}>
                    <button className="w-full py-3 bg-[#ED2624] hover:bg-[#c9201e] text-white rounded-xl font-bold font-['Dm_Sans'] transition-all transform hover:scale-[1.02]">
                      Contact Us Now
                    </button>
                  </Link>
                  
                  <button 
                    onClick={handleClose}
                    className="text-gray-400 text-sm hover:text-gray-600 font-medium font-['Inter']"
                  >
                    No, thanks. I'll browse first.
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default HomePopup;