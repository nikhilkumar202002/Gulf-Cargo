'use client'

import React, { useEffect, useRef, useState } from 'react'
import { BiPhoneCall } from "react-icons/bi";
import { LuMail } from "react-icons/lu";
import { FaInstagram, FaFacebook, FaLinkedinIn } from "react-icons/fa";
import Image from 'next/image';
import "./Header.css";
import { MdArrowForward } from 'react-icons/md'
import { RiCloseLargeFill } from "react-icons/ri";
import { CgMenuGridO } from "react-icons/cg";
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { AnimatePresence, motion } from 'framer-motion'

const Header = () => {
  const pathname = usePathname()
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

  return (
    <>
      {/* Fixed wrapper for full header */}
      <header
        className={`fixed left-0 right-0 top-0 bg-white transition-transform duration-300 ease-out z-[60] ${sticky ? 'translate-y-0' : '-translate-y-full'}`}
      >
        {/* Top Bar */}
        <div className="navbar-top bg-gray-100 text-sm">
          <div className="navbar-top-container container mx-auto flex justify-between items-center py-1 px-4">
            <ul className='inline-flex gap-4'>
              <li className='flex items-center gap-2'><BiPhoneCall />+966 54 761 9393, +966 54 314 5105</li>
              <li className='flex items-center gap-2'><LuMail />info@gulfcargoksa.com</li>
            </ul>
            <ul className='inline-flex gap-2'>
              <li><FaInstagram /></li>
              <li><FaFacebook /></li>
              <li><FaLinkedinIn /></li>
            </ul>
          </div>
        </div>

        {/* Main Navbar */}
        <div className="navbar-main">
          <div className="container mx-auto flex justify-between items-center h-16 px-4">
            <Image src="/Logo.png" width={120} height={40} alt='Gulf Cargo' priority />

            {/* Desktop */}
            <ul className="navbar-main-right hidden md:inline-flex gap-5 items-center">
              {navItems.map((item) => (
                <li
                  key={item.name}
                  className={`${pathname === item.href ? 'text-[#ED2624]' : 'text-gray-700'} hover:text-[#ED2624] transition`}
                >
                  <Link href={item.href}>{item.name}</Link>
                </li>
              ))}
              <li>
                <Link href="/support">
                  <button className="flex items-center gap-1 bg-[#ED2624] text-white py-2 px-4 rounded">
                    Contact <MdArrowForward />
                  </button>
                </Link>
              </li>
            </ul>

            {/* Mobile Hamburger */}
            <div className="md:hidden">
              <button onClick={() => setIsOpen(true)}>
                <CgMenuGridO size={28} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Spacer (height = top bar + navbar) */}
      <div className="h-[72px] md:h-[88px]" />

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
              <div className="flex items-center justify-between px-4 py-3">
                <Image src="/Logo.png" width={120} height={40} alt="Gulf Cargo" />
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
                  <li>
                    <Link href="/support" onClick={() => setIsOpen(false)}>
                      <button className="flex items-center gap-1 bg-[#ED2624] text-white py-2 px-4 rounded">
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
