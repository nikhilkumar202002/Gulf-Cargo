"use client"

import { MdAddCall } from "react-icons/md";
import { FaWhatsapp } from "react-icons/fa6";
import { MdOutlineEmail } from "react-icons/md";
import "./TrackingPageStyles.css"

const ContactCard = () => {
  return (
    <>
        <section className="contact-card">
            <div className="contact-card-container">
                <div className="contact-card-items">
                    <div className="contact-card-header">
                        <h4>Contact Us</h4>
                    </div>
                    <div className="contact-card-item flex items-center gap-3 pt-2">
                        
                        <div className="contact-card-icon">
                            <MdAddCall/>
                        </div>
                        <div className="contact-card-content">
                            <a href="">+966 54 761 9393</a>
                        </div>

                    </div>

                    <div className="contact-card-item flex items-center gap-3">
                        
                        <div className="contact-card-icon">
                            <FaWhatsapp/>
                        </div>
                        <div className="contact-card-content">
                            <a href="">+966 54 314 5105</a>
                        </div>

                    </div>

                    <div className="contact-card-item flex items-center gap-3">
                        
                        <div className="contact-card-icon">
                            <MdOutlineEmail/>
                        </div>
                        <div className="contact-card-content">
                            <a href="">gulfcargoksa@gmail.com</a>
                        </div>

                    </div>

                </div>
            </div>
        </section>
    </>
  )
}

export default ContactCard