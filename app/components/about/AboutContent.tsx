import Image from 'next/image'
import React from 'react'

const AboutContent = () => {
  return (
    <>
        <section className='about-content'>
            <div className="about-content-container container">
                <div className="about-content-row grid grid-cols-1 lg:grid-cols-[60%_40%] gap-8 items-center">
                    <div className="about-content-col">
                        <div className="about-content-left">
                            <h1 className='about-content-left-heading'><span className='about-content-left-heading-hightlight'>About</span> Gulf Cargo</h1>
                            <p className='about-content-left-description'>With over 13 years of excellence, Gulf Cargo has grown into one of the leading cargo and logistics companies in the GCC, offering point-to-point domestic and international freight solutions. Our journey began with a simple mission — to provide businesses and individuals with reliable, efficient, and customer-focused shipping services. <br></br><br></br>

                            From air and sea to road freight, we offer customized logistics and supply chain solutions designed to fit the unique needs of our clients. Whether it’s urgent air cargo, cost-effective sea freight, or flexible road transport, we handle every shipment with precision, care, and dedication.
                            <br></br><br></br>
                            Our strength lies in understanding our clients’ needs and aligning our services to deliver beyond expectations. We’ve built a reputation for on-time delivery, transparency, and adaptability, making us the trusted choice for companies across industries — from small businesses to large corporations.</p>
                        </div>
                    </div>

                    <div className="about-content-col flex justify-center lg:justify-end">
                        <div className="about-content-images">
                            <div className="about-content-image ">
                                <Image src="../Images/about-content-photo.webp" alt='About Gulf Cargo' width={1200} height={0} priority/>
                            </div>     
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </>
  )
}

export default AboutContent