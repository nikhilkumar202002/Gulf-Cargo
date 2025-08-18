'use client'

import React from 'react'
import { BiPhoneCall } from "react-icons/bi";
import { LuMail } from "react-icons/lu";
import { FaInstagram, FaFacebook, FaLinkedinIn } from "react-icons/fa";
import Image from 'next/image';
import "./Header.css";
import { MdArrowForward} from 'react-icons/md'
import { RiCloseLargeFill } from "react-icons/ri";
import { CgMenuGridO } from "react-icons/cg";
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import Link from 'next/link'

const Header = () => {

    const pathname = usePathname()
    const [isOpen, setIsOpen] = useState(false)


    const navItems = [
        { name: 'Home', href: '/' },
        { name: 'Company', href: '/company' },
        { name: 'Services', href: '/services' },
        { name: 'Blog', href: '/blog' },
        { name: 'Track your order', href: '/track' },
    ]


    return (
        <>
            <nav>
                <div className="navbar-container">
                    <div className="navbar-top">
                        <div className="navbar-top-container container flex justify-between items-center">
                            <div className="navbar-top-left navbar-top-list">
                                <ul className='inline-flex gap-4'>
                                    <li className='items-center flex gap-2'><BiPhoneCall />+966 54 761 9393, +966 54 314 5105</li>
                                    <li className='items-center flex gap-2'><LuMail />info@gulfcargoksa.com</li>
                                </ul>
                            </div>
                            <div className="navbar-top-right navbar-top-list">
                                <ul className='inline-flex gap-2'>
                                    <li><FaInstagram /></li>
                                    <li><FaFacebook /></li>
                                    <li><FaLinkedinIn /></li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className="navbar-main bg-white">
                        <div className="navbar-main-container container mx-auto flex justify-between items-center">

                            {/* Logo */}
                            <div className="navbar-main-left">
                                <Image src="/Logo.png" width={120} height={40} alt='Gulf Cargo' />
                            </div>

                            {/* Desktop Menu */}
                            <div className="hidden md:block navbar-main-right">
                                <ul className="inline-flex gap-5 items-center">

                                    {navItems.map((item) => (
                                        <li
                                            key={item.name}
                                            className={`${pathname === item.href ? 'text-[#262262] font-semibold' : 'text-gray-700'} hover:text-[#262262] transition`}
                                        >
                                            <Link href={item.href}>{item.name}</Link>
                                        </li>
                                    ))}

                                    <li className="navbar-main-btn">
                                        <Link href="/support">
                                        <button className="navbar-btn flex items-center gap-1 text-white py-2 px-4 rounded">
                                            Contact <MdArrowForward />
                                        </button>
                                        </Link>
                                    </li>
                                </ul>
                            </div>

                            {/* Mobile Hamburger */}
                            <div className="md:hidden mobile-hamburger">
                                <button onClick={() => setIsOpen(!isOpen)}>
                                    {isOpen ? <RiCloseLargeFill size={28} /> : <CgMenuGridO size={28} />}
                                </button>
                            </div>
                        </div>

                        {/* Mobile Menu */}
                        {isOpen && (
                            <div className="md:hidden bg-white px-4 py-2 shadow">
                                <ul className="flex flex-col gap-4">
                                    {navItems.map((item) => (
                                        <li
                                            key={item.name}
                                            className={`${pathname === item.href ? 'text-[#262262] font-semibold' : 'text-gray-700'} hover:text-[#262262] transition`}
                                        >
                                            <Link href={item.href} onClick={() => setIsOpen(false)}>
                                                {item.name}
                                            </Link>
                                        </li>
                                    ))}
                                    <li>
                                        <Link href="/support">
                                        <button className="flex items-center gap-1 bg-[#262262] text-white py-2 px-4 rounded">
                                            Contact <MdArrowForward />
                                        </button>
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            </nav>
        </>
    )
}

export default Header