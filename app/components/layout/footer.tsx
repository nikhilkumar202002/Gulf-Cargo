import Image from 'next/image'
import React from 'react'
import { FaInstagram, FaFacebook, FaLinkedinIn } from "react-icons/fa";
import Link from 'next/link';
import { IoMdArrowDroprightCircle } from "react-icons/io";
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
                      <li><Link href="/" className='flex gap-2 items-center'><span className='footer-menu-list-icon'><IoMdArrowDroprightCircle/></span>Home</Link></li>
                      <li><Link href="/company" className='flex gap-2 items-center'><span className='footer-menu-list-icon' ><IoMdArrowDroprightCircle/></span>About Us</Link></li>
                      <li><Link href="/services" className='flex gap-2 items-center'><span className='footer-menu-list-icon'><IoMdArrowDroprightCircle/></span>Service</Link></li>
                      <li><Link href="/trackorder" className='flex gap-2 items-center'><span className='footer-menu-list-icon'><IoMdArrowDroprightCircle/></span>Tracking</Link></li>
                      <li><Link href="/support" className='flex gap-2 items-center'><span className='footer-menu-list-icon'><IoMdArrowDroprightCircle/></span>Contact Us</Link></li>
                    </ul>
                </div>
              </div>
              <div className="footer-col">
                <div className='footer-menu-heading'>Services</div>
              <ul className="space-y-2">

  <li>
    <Link href="/services#worldwide-air-cargo-services" className="flex gap-2 items-center">
      <span className='footer-menu-list-icon'><IoMdArrowDroprightCircle/></span>
      Worldwide Air Cargo Services
    </Link>
  </li>

  <li>
    <Link href="/services#door-to-door-services" className="flex gap-2 items-center">
      <span className='footer-menu-list-icon'><IoMdArrowDroprightCircle/></span>
      Door-to-Door Services
    </Link>
  </li>

  <li>
    <Link href="/services#domestic-delivery-saudi-arabia" className="flex gap-2 items-center">
      <span className='footer-menu-list-icon'><IoMdArrowDroprightCircle/></span>
      Domestic Delivery in Saudi Arabia
    </Link>
  </li>

  <li>
    <Link href="/services#house-shifting-and-packing" className="flex gap-2 items-center">
      <span className='footer-menu-list-icon'><IoMdArrowDroprightCircle/></span>
      House Shifting & Packing
    </Link>
  </li>

  <li>
    <Link href="/services#gcc-door-delivery" className="flex gap-2 items-center">
      <span className='footer-menu-list-icon'><IoMdArrowDroprightCircle/></span>
      GCC Door Delivery
    </Link>
  </li>

  <li>
    <Link href="/services#commercial-customs-clearance" className="flex gap-2 items-center">
      <span className='footer-menu-list-icon'><IoMdArrowDroprightCircle/></span>
      Commercial Customs Clearance
    </Link>
  </li>

  <li>
    <Link href="/services#container-services-providing" className="flex gap-2 items-center">
      <span className='footer-menu-list-icon'><IoMdArrowDroprightCircle/></span>
      Container Services & Providing
    </Link>
  </li>

  <li>
    <Link href="/services#warehouse-and-storage" className="flex gap-2 items-center">
      <span className='footer-menu-list-icon'><IoMdArrowDroprightCircle/></span>
      Warehouse & Storage Facilities
    </Link>
  </li>

</ul>

              </div>
              <div className="footer-col">
                <div className='footer-menu-heading'>Contact Information</div>
                 <ul>
                      <li className='flex gap-2 items-start'><span className='footer-menu-list-icon'><IoMdArrowDroprightCircle/></span>Location: Gulf cargo LLC, Al Oud, Hamad Ibn Laaboun, 2912, Al Oud, Riyadh 12665, Riyadh 12211, Saudi Arabia</li>
                      <li className='flex gap-2 items-center'><span className='footer-menu-list-icon'><IoMdArrowDroprightCircle/></span>Call Now: +966 54 761 9393</li>
                      <li className='flex gap-2 items-center'><span className='footer-menu-list-icon'><IoMdArrowDroprightCircle/></span>Email Us: info@gulfcargo.com</li>
                      <li className='flex gap-2 items-start'><span className='footer-menu-list-icon'><IoMdArrowDroprightCircle/></span>Time: Sunday – Saturday, 8:00 AM – 8:00 PM</li>
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