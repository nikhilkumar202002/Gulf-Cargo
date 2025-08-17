import Breadcrumbs from "../common/Breadcrumbs";    
import React from 'react';
import "./ServiceStyles.css";

const ServicesBanner = () => {
  return (
    <>
        <section className="service-page-banner">
            <div className="service-page-main-container container relative bg-[url('/Banners/service-banner.jpg')] bg-cover bg-center bg-no-repeat ">
                <div className="service-page-container container-small">
                    <h1 className='service-banner-content-heading'>Gulf Cargo - Comprehensive Logistics Solutions</h1>
                    <p className='service-banner-content-description'>Gulf Cargo stands as your premier logistics and cargo transportation partner across the Gulf region, delivering innovative solutions that move your business forward. With extensive experience in international freight forwarding, supply chain management, and comprehensive logistics services, we ensure your cargo reaches its destination safely, efficiently, and on time.</p>
                    <div className="about-content-breadcrumbs">
                    <Breadcrumbs
                                items={[
                                    { label: "Home", href: "/" },
                                    { label: "Our Servces" }
                                ]}
                                />
                    </div>
                </div>
            </div>
        </section>
    </>
  )
}

export default ServicesBanner