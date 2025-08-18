import React from 'react'
import { Button } from '@radix-ui/themes';
import { FaInstagram, FaFacebookF,FaLinkedinIn  } from "react-icons/fa";

const SupportContactForm = () => {
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
                           <ul className='flex gap-2'>
                            <li className='list-icons'><FaInstagram/></li>
                            <li className='list-icons'><FaFacebookF/></li>
                            <li className='list-icons'><FaLinkedinIn/></li>
                           </ul>
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

export default SupportContactForm