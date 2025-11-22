'use client'

import "./Banner.css";
import TrackingForm from "../tracking/TrackingForm";

const Banner = () => {
  return (
    <section className="main-banner">
        <div className="main-banner-container container">
            <div className="main-banner-inner">
                {/* Added 'w-full' to ensure grid stretches correctly inside the flex container */}
                <div className="main-banner-flex grid grid-cols-1 md:grid-cols-2 items-center gap-20 w-full">
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