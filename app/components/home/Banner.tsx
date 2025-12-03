'use client'

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import "./Banner.css";
import TrackingForm from "../tracking/TrackingForm";

// Define your background images here
const backgroundImages = [
    "/Banners/main-banner-1.webp", // Ensure these paths are correct in your public folder
    "/Banners/main-banner-2.webp",
    "/Banners/main-banner-3.webp"
];

const Banner = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Cycle through images every 6 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev === backgroundImages.length - 1 ? 0 : prev + 1));
    }, 6000); 
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="main-banner">
        <div className="main-banner-container container">
            <div className="main-banner-inner">
                
                {/* --- BACKGROUND SLIDESHOW START --- */}
                <div className="banner-slideshow">
                   {backgroundImages.map((src, index) => (
                       <div key={index} className={`banner-slide ${index === currentImageIndex ? 'active' : ''}`}>
                           <Image 
                               src={src} 
                               alt="Banner Background" 
                               fill 
                               style={{ objectFit: "cover" }}
                               priority={index === 0}
                           />
                       </div>
                   ))}
                   {/* Gradient Overlay to darken images for text readability */}
                   <div className="banner-overlay"></div>
                </div>
                {/* --- BACKGROUND SLIDESHOW END --- */}

                {/* Content Layer (Added 'relative z-10' to ensure it sits on top of images) */}
                <div className="main-banner-flex grid grid-cols-1 md:grid-cols-2 items-center gap-6 w-full relative z-10">
                    <div className="main-banner-content">
                        <h1>Smart Logistics Trusted Across the Gulf for 13+ Years</h1>
                        <p>Delivering safe, fast, and reliable cargo services across the GCC and worldwide. Custom logistics solutions designed to keep your business moving smoothly.</p>
                        <a href="/support">Get a Quote</a>
                    </div>

                    <div className="main-banner-form">
                        <TrackingForm />
                    </div>
                </div>
            </div>               
        </div>
    </section>
  )
}

export default Banner