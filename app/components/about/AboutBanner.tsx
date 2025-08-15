import Breadcrumbs from "../common/Breadcrumbs";    
import React from 'react';
import "./AboutStyles.css";

const AboutBanner = () => {
  return (
    <>
        <section className="about-banner">
            <div className="about-container container relative bg-[url('/Banners/about-banner.jpg')] bg-cover bg-center bg-no-repeat">
                <div className="about-content-container container-small">
                    <h1 className='about-content-heading'>Delivering Trust, One Parcel at a Time</h1>
                    <p className='about-content-description'>We are committed to making every delivery fast, secure, and hassle-free. With our reliable logistics network and customer-first approach, we ensure your shipments reach their destination safely and on time. From real-time tracking to dedicated support, we go the extra mile to keep you connected to what matters most.</p>
                    <div className="about-content-breadcrumbs">
                    <Breadcrumbs
                                items={[
                                    { label: "Home", href: "/" },
                                    { label: "About Gulf Cargo" }
                                ]}
                                />
                    </div>
                </div>
            </div>
        </section>
    </>
  )
}

export default AboutBanner