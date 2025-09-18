'use client'

import { Button } from '@radix-ui/themes'
import React from 'react'
import "./HomeStyles.css";
import TrackingForm from '../tracking/TrackingForm';

const hero = () => {
  return (
    <>
        <section className='hero'>
            <div className="hero-container container relative bg-[url('/Banners/main-banner-1.webp')] bg-cover bg-center bg-no-repeat">
                <div className="hero-content-flex container-small flex items-center">
                    <div className="hero-content">
                        <h1 className='hero-content-heading'>GULF CARGO LLC</h1>
                        <p className='hero-content-description'>Provides full service of Air/Sea/Land - Import & Export Customs Clearance, International Freight Forwarding and all types of Cargo Packing based on our long field experience. We globally support all logistics requirements.</p>
                        <div className="hero-content-btns flex gap-3">
                            <Button>Our Services</Button>
                            <Button className='hero-content-btn-2'>More Info</Button>
                        </div>
                    </div>

                    <div className="hero-tracking-form">
                        <TrackingForm/>
                    </div>
                </div>
            </div>
        </section>
    </>
  )
}

export default hero