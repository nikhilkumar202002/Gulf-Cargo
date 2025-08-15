import React from 'react'
import { FaLocationDot } from "react-icons/fa6";
import { MdPhoneCallback } from "react-icons/md";
import { IoMailUnreadSharp } from "react-icons/io5";
import { PiClockCountdownFill } from "react-icons/pi";
import { Button } from '@radix-ui/themes';

const contactus = () => {
  return (
    <>
        <section className="contact-section">
            <div className="contact-container container">
                <div className="contact-row grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 xl:gap-16">
                    <div className="contact-col">
                        <div className="contact-content">
                            <h1 className='contact-heading'>Get in <span className='contact-hightlight'>Touch</span> With <span className='contact-hightlight'>Gulf</span> Cargo.</h1>
                            <p className='contact-description'>We’re here to help with all your cargo and logistics needs — from inquiries to bookings.</p>
                        </div>

                        <div className="contact-icon-list">
                            <div className="contact-icon-list-items flex items-center gap-4">
                                <span className='contact-icons'><FaLocationDot/></span>
                                <h4 className='contact-lists'>Gulf Cargo LLC, KSA</h4>
                            </div>

                             <div className="contact-icon-list-items flex items-center gap-4 py-3">
                                <span className='contact-icons'><MdPhoneCallback/></span>
                                <h4 className='contact-lists'>+966 54 761 9393</h4>
                            </div>

                             <div className="contact-icon-list-items flex items-center gap-4">
                                <span className='contact-icons'><IoMailUnreadSharp/></span>
                                <h4 className='contact-lists'>info@gulfcargoksa.com</h4>
                            </div>

                             <div className="contact-icon-list-items flex items-center gap-4 py-3">
                                <span className='contact-icons'><PiClockCountdownFill/></span>
                                <h4 className='contact-lists'>Sunday – Saturday, 24/7 Service</h4>
                            </div>
                        </div>
                    </div>

                    <div className="contact-col">
                        <div className="contact-form">
                            <form action="">
                                <div className="contact-form-row">
                                    <label htmlFor="">Full Name</label> <br />
                                    <input type="text" placeholder='Adam John'/>
                                </div>
                                <div className="contact-form-row margin-top">
                                    <label htmlFor="">Email</label> <br />
                                    <input type="text" placeholder='adamjohn@gmail.com'/>
                                </div>
                                <div className="contact-form-row margin-top">
                                    <label htmlFor="">Phone Number</label> <br />
                                    <input type="text" placeholder='+971 50 123 4567'/>
                                </div>
                                <div className="contact-form-row margin-top">
                                    <label htmlFor="">Message</label> <br />
                                    <textarea name="" id="" rows={5} placeholder='I would like to get a quote for shipping from Dubai to Riyadh.'></textarea>
                                </div>

                                 <div className="contact-form-row">
                                    <Button>Send Message</Button>
                                 </div>
                                
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </>
  )
}

export default contactus