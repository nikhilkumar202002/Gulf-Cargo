import Image from 'next/image'
import React from 'react'
import { FaInstagram, FaFacebook, FaLinkedinIn } from "react-icons/fa";
import "./Footer.css";

const Footer = () => {
  return (
    <>
      <footer>
        <div className="footer-section">
          <div className="footer-container container">
            <div className="footer-row grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="footer-col">
                <div className="footer-item">
                    <Image src="/Logo-white.png" width={120} height={40} alt='Gulf Cargo' priority/>
                    <p className='footer-tagline'>Delivering Trust, One Shipment at a Time.</p>

                    <div className="footer-socials flex items-center gap-2">
                      <div className="footer-social"><FaInstagram/></div>
                      <div className="footer-social"><FaFacebook/></div>
                      <div className="footer-social"><FaLinkedinIn/></div>
                    </div>
                </div>
              </div>
              <div className="footer-col">
                 <div className="footer-item">
                <div className='footer-menu-heading'>Quick Links</div>
                    <ul>
                      <li>Home</li>
                      <li>About Us</li>
                      <li>Service</li>
                      <li>Tracking</li>
                      <li>Contact Us</li>
                    </ul>
                </div>
              </div>
              <div className="footer-col">
                <div className='footer-menu-heading'>Services</div>
                 <ul>
                      <li>Air Freight</li>
                      <li>Sea Freight</li>
                      <li>Road Freight</li>
                      <li>Supply Chain Solutions</li>
                      <li>Customs Clearance</li>
                    </ul>
              </div>
              <div className="footer-col">
                <div className='footer-menu-heading'>Contact Information</div>
                 <ul>
                      <li>Location: Gulf cargo LLC, UAE</li>
                      <li>Call Now: +966 54 761 9393</li>
                      <li>Email Us: info@gulfcargo.com</li>
                      <li>Time: Sunday – Saturday, 8:00 AM – 8:00 PM</li>
                    </ul>
              </div>
            </div>

            <div className="footer-row-bottom flex flex-col md:flex-row justify-between items-center">
              <div className="footer-bottom-left">
                <p>© {new Date().getFullYear()} Gulf Cargo. All rights reserved.</p>
              </div>
              <div className="footer-bottom-right">
                <ul className='flex items-center gap-2'>
                  <li>Privacy Policy</li>
                  <li>Terms & Conditions</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  )
}

export default Footer