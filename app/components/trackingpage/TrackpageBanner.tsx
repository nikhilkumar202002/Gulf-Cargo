import React from 'react'
import Breadcrumbs from "../common/Breadcrumbs"; 
import "./TrackingPageStyles.css"

const TrackpageBanner = () => {
  return (
    <>
          <section className="about-banner">
                    <div className="about-page-container container relative bg-[url('/Banners/about-banner.jpg')] bg-cover bg-center bg-no-repeat">
                        <div className="about-content-container container-small">
                            <h1 className='about-content-page-heading'>Track Your Order with Confidence</h1>
                            <p className='about-content-page-description'>Stay updated on every step of your shipment. Our reliable logistics network ensures your parcel is delivered safely and on time. With real-time tracking and dedicated support, you can monitor your order’s journey and stay connected to what matters most.</p>
                            <div className="about-content-breadcrumbs">
                            <Breadcrumbs
                                        items={[
                                            { label: "Home", href: "/" },
                                            { label: "Track your order" }
                                        ]}
                                        />
                            </div>
                        </div>
                    </div>
                </section>
    </>
  )
}

export default TrackpageBanner