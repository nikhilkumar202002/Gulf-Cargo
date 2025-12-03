'use client'

import React, { useEffect, useRef, useState } from 'react'
import { BiPhoneCall } from "react-icons/bi";
import { LuMail } from "react-icons/lu";
import { FaInstagram, FaFacebook } from "react-icons/fa";
import Image from 'next/image';
import "./Header.css";
import { MdArrowForward } from 'react-icons/md'
import { RiCloseLargeFill } from "react-icons/ri";
import { CgMenuGridO } from "react-icons/cg";
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { AnimatePresence, motion } from 'framer-motion'
import GoogleTranslate from '../common/GoogleTranslate';

const Header = () => {
  const pathnameRaw = usePathname() || "/";
  const pathname = pathnameRaw.replace(/\/+$/, "") || "/";
  const [isOpen, setIsOpen] = useState(false)
  const [sticky, setSticky] = useState(true)

  const lastScrollYRef = useRef(0)
  const tickingRef = useRef(false)

  // Lock body scroll when mobile nav open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
  }, [isOpen])

  // Scroll direction logic
  useEffect(() => {
    const threshold = 80
    const onScroll = () => {
      if (tickingRef.current) return
      tickingRef.current = true
      requestAnimationFrame(() => {
        const current = window.scrollY
        const last = lastScrollYRef.current

        if (current > last && current > threshold) {
          setSticky(false) // hide
        } else {
          setSticky(true) // show
        }

        lastScrollYRef.current = current
        tickingRef.current = false
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'Company', href: '/company' },
    { name: 'Services', href: '/services' },
    { name: 'Track your order', href: '/trackorder' },
  ]

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    // active on exact or nested, e.g. /company/team highlights /company
    return pathname === href || pathname.startsWith(href + "/");
  };
  return (
    <>
      {/* Fixed wrapper for full header */}
      <header
        className={`navbar-top-container fixed left-0 right-0 top-0 bg-white transition-transform duration-300 ease-out z-[60] ${sticky ? 'translate-y-0' : '-translate-y-full'}`}
      >
        {/* Top Bar (Desktop Only) */}
        <div className="navbar-top bg-gray-100 text-sm">
          <div className="navbar-top-container container mx-auto flex justify-between items-center py-1 px-4">
            <ul className='inline-flex gap-4 navbar-top-list'>
              <li className='flex items-center gap-2'><BiPhoneCall /><Link href="tel:+966547619393">+966 54 761 9393,</Link> <Link href="tel:+966543145105">+966 54 314 5105</Link></li>
              <li className='flex items-center gap-2'><LuMail /><Link href="mailto:info@gulfcargoksa.com">info@gulfcargoksa.com</Link></li>
            </ul>

            <ul className='inline-flex gap-2 items-center'>
              {/* Desktop Widget */}
              <li className="flex items-center">
                <GoogleTranslate />
              </li>

              {/* Divider Line */}
              <div className="h-4 w-[1px] bg-gray-300 mx-2"></div>

              {/* Social Icons */}
              <li className='navbar-top-social-icons'><Link href="..."><FaInstagram /></Link></li>
              <li className='navbar-top-social-icons'><Link href="..."><FaFacebook /></Link></li>
            </ul>
          </div>
        </div>

        {/* Main Navbar */}
        <div className="navbar-main">
          <div className="navbar-logo container mx-auto flex justify-between items-center px-4">
            <Link href="/">
              <Image src="/Logo.png" width={90} height={40} alt='Gulf Cargo' priority />
            </Link>

            <ul className="navbar-main-right hidden md:inline-flex gap-5 items-center">
              {navItems.map((item) => {
                const active = isActive(item.href);
                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={[
                        "transition",
                        active ? "text-[#ED2624] font-semibold" : "text-gray-700 hover:text-[#ED2624]",
                      ].join(" ")}
                      aria-current={active ? "page" : undefined}
                    >
                      {item.name}
                    </Link>
                  </li>
                );
              })}
              <li>
                <Link href="/support">
                  <button className="header-contact-btn flex items-center gap-1 bg-[#ED2624] text-white py-2 px-4 rounded">
                    Contact <MdArrowForward />
                  </button>
                </Link>
              </li>
            </ul>

         {/* Mobile Hamburger & Translator Wrapper */}
{/* Mobile Hamburger & Translator Wrapper */}
<div className="md:hidden flex items-center gap-4"> 
  {/* gap-4 creates space between the translator and the icon */}
  
  <div className='google-translator-mobile flex items-center justify-center'>
    <GoogleTranslate />
  </div>

  <button 
    onClick={() => setIsOpen(true)}
    className="flex items-center justify-center text-gray-700 hover:text-[#ED2624] transition-colors"
  >
    <CgMenuGridO size={28} />
  </button>
</div>
          </div>
        </div>
      </header>


      {/* Mobile Nav Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-[70] bg-black/40"
              onClick={() => setIsOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
            <motion.aside
              className="fixed top-0 right-0 z-[80] h-full w-[88%] max-w-sm bg-white shadow-xl overflow-y-auto"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 380, damping: 32 }}
            >
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                <Image src="/Logo.png" width={100} height={35} alt="Gulf Cargo" />
                <button onClick={() => setIsOpen(false)}>
                  <RiCloseLargeFill size={22} />
                </button>
              </div>
              <nav className="p-4">
                <ul className="flex flex-col gap-4">
                  {navItems.map((item) => (
                    <li
                      key={item.name}
                      className={`${pathname === item.href ? 'text-[#ED2624] font-semibold' : 'text-gray-700'} hover:text-[#ED2624]`}
                    >
                      <Link href={item.href} onClick={() => setIsOpen(false)}>
                        {item.name}
                      </Link>
                    </li>
                  ))}
          
                  <li className="pt-2">
                    <Link href="/support" onClick={() => setIsOpen(false)}>
                      <button className=" header-contact-btn flex items-center justify-center w-full gap-1 bg-[#ED2624] text-white py-3 px-4 rounded-2xl font-medium">
                        Contact <MdArrowForward />
                      </button>
                    </Link>
                  </li>
                </ul>
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

export default Header