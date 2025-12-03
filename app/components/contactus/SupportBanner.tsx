import React from 'react'
import Breadcrumbs from "../common/Breadcrumbs";    
import "./SupportStyles.css"

const SupportBanner = () => {
  return (
    <>
        <section className="support-page-banner">
            <div className="support-page-container container relative bg-[url('/Banners/support-banner.webp')] bg-cover bg-center bg-no-repeat">
                <div className="support-content-container px-15">
                    <h1 className='support-content-page-heading'>Delivering Trust, One Parcel at a Time</h1>
                    <p className='support-content-page-description'>We are committed to making every delivery fast, secure, and hassle-free. With our reliable logistics network and customer-first approach, we ensure your shipments reach their destination safely and on time. From real-time tracking to dedicated support, we go the extra mile to keep you connected to what matters most.</p>
                    <div className="support-content-breadcrumbs">
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

export default SupportBanner