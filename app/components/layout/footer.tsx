import Image from 'next/image'
import React from 'react'
import { FaInstagram, FaFacebook, FaLinkedinIn } from "react-icons/fa";
import Link from 'next/link';
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
                      <li><Link href="/">Home</Link></li>
                      <li><Link href="/company">About Us</Link></li>
                      <li><Link href="/services">Service</Link></li>
                      <li><Link href="/trackorder">Tracking</Link></li>
                      <li><Link href="/support">Contact Us</Link></li>
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
                      <li>Location: Gulf cargo LLC, Al Oud, Hamad Ibn Laaboun, 2912, Al Oud, Riyadh 12665, Riyadh 12211, Saudi Arabia</li>
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
                  <li><Link href="/privacypolicy">Privacy Policy</Link></li>
                  <li><Link href="/termsconditions">Terms & Conditions</Link></li>
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