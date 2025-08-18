"use client";

import React from 'react'
import "./SupportStyles.css"
import { BiSolidPhoneCall } from "react-icons/bi";
import { IoMail } from "react-icons/io5";


const SupportMap = () => {
  return (
    <>
        <section className="support-map-section">
            <div className="support-map-container container">
                <div className="support-map-header">
                    <h1 className='support-map-heading'>Office<span className='support-map-heading-highlight'> Locations</span></h1>
                </div>

                <div className="support-map-flex grid grid-cols-1 md:grid-cols-[40%_60%] gap-6">
                    <div className="support-map-contact border border-dashed border-gray-300">
                        <h1 className="support-map-headoffice-heading">Head Office (Saudi Arabia)</h1>
                        <h4 className="support-map-headoffice-subheading">Prince Mohammed Bin Abdulrahman Bin Abdulaziz</h4>
                        <p className='support-map-headoffice-description'>As Sulay, Riyadh – 14273, Saudi Arabia</p>

                        <div className="support-map-lists">
                            <div className="support-map-list flex gap-3 items-center">
                                <span className='support-map-list-icon'><BiSolidPhoneCall/></span>
                                <h1>+966 54 761 9393</h1>
                            </div>
                            <div className="support-map-list flex gap-3 items-center padding">
                                <span className='support-map-list-icon'><BiSolidPhoneCall/></span>
                                <h1>+966 54 314 5105</h1>
                            </div>
                            <div className="support-map-list flex gap-3 items-center">
                                <span className='support-map-list-icon'><IoMail/></span>
                                <h1>info@gulfcargoksa.com</h1>
                            </div>
                        </div>
                    </div>

                    <div className="support-map-contact-intergration">
                        <div className="support-map-contact-display">
                            <iframe
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3627.117494831544!2d46.726093999999996!3d24.619635!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e2fa721c5182035%3A0x6735d5d86726830a!2sGULF%20INTERNATIONAL%20CARGO%20AND%20LOGISTICS!5e0!3m2!1sen!2sin!4v1755502504536!5m2!1sen!2sin"
                                    width="600"
                                    height="450"
                                    style={{ border: 0 }}
                                    allowFullScreen
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                    />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </>
  )
}

export default SupportMap