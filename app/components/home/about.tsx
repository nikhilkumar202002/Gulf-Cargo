import { Button } from '@radix-ui/themes'
import React from 'react';
import "./HomeStyles.css";

const about = () => {
  return (
    <>
        <section className='about-section'>
            <div className="about-container container">
                <div className="about-row grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
                    <div className="about-col w-full">
                        <div className="about-video">
                           <video src="/videos/gulf-cargo-about-video.mp4" autoPlay loop muted playsInline className='w-full h-auto bg-cover'/>
                        </div>
                    </div>
                    
                    <div className="about-col max-w-xl mx-auto">
                        <div className="about-content max-w-xl">
                            <h1 className="about-content-heading">About Gulf Cargo</h1>
                            <p className='about-content-description'>With over 13 years of trusted service, Gulf Cargo is a leading cargo and logistics company in the GCC, specializing in point-to-point domestic and international freight. We provide customized logistics and supply chain solutions that ensure your shipments are delivered safely, on time, and with care. Whether by air, sea, or road, our dedicated team works 7 days a week to meet your business needs.</p>

                            <div className="about-content-counters grid grid-cols-2 gap-5 mt-8 text-center">
                                <div className="about-content-counter">
                                    <h1 className="about-counter-number">13+</h1>
                                    <h4 className='about-counter-heading'>Years of Experience</h4>
                                </div>

                                 <div className="about-content-counter">
                                    <h1 className="about-counter-number">500K+</h1>
                                    <h4 className='about-counter-heading'>Shipments Delivered</h4>
                                </div>

                                 <div className="about-content-counter">
                                    <h1 className="about-counter-number">120+</h1>
                                    <h4 className='about-counter-heading'>Destinations Covered</h4>
                                </div>

                                 <div className="about-content-counter">
                                    <h1 className="about-counter-number">1M+</h1>
                                    <h4 className='about-counter-heading'>Happy Customers</h4>
                                </div>
                            </div>

                            <div className="about-cta">
                                <Button>More About Gulf Cargo</Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </>
  )
}

export default about