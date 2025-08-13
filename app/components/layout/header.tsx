import React from 'react'
import { BiPhoneCall } from "react-icons/bi";
import { LuMail } from "react-icons/lu";
import { FaInstagram, FaFacebook, FaLinkedinIn } from "react-icons/fa";
import Image from 'next/image';
import { Button } from '@radix-ui/themes';
import "./Header.css";
import { MdArrowForward } from "react-icons/md";

const header = () => {
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

                    <div className="navbar-main">
                        <div className="navbar-main-container container flex justify-between items-center">
                            <div className="navbar-main-left">
                                <Image src="/Logo.png" width={120} height={0} alt='Gulf Cargo' />
                            </div>
                            <div className="navbar-main-right">
                                <ul className='inline-flex gap-5 items-center'>
                                    <li>Home</li>
                                    <li>Company</li>
                                    <li>Services</li>
                                    <li>Blog</li>
                                    <li>Track your order</li>
                                    <li className='navbar-main-btn'><Button>Contact<MdArrowForward/></Button></li>
                                </ul>
                            </div>
                        </div>

                    </div>
                </div>
            </nav>
        </>
    )
}

export default header