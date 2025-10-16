
import React from 'react'
import Link from 'next/link'
import "./HomeStyles.css"

const ctasection = () => {
  return (
    <>
        <section className="cta-section">
            <div className="cta-container container">
                <div className="cta-content">
                    <h1 className='cta-heading'>Ready to Ship With Confidence?</h1>
                    <p className='cta-description'>Partner with Gulf Cargo for fast, secure, and hassle-free deliveries across the GCC and beyond.</p>
                    <Link href="/support">Contact Us Today</Link>
                </div>
            </div>
        </section>
    </>
  )
}

export default ctasection