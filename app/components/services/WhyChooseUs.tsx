import Image from 'next/image'
import React from 'react'
import { FaSquareCheck } from "react-icons/fa6";

const WhyChooseUs = () => {

    const whyChooseUs = [
  {
    title: "Comprehensive Logistics Solutions",
    description:
      "From door-to-door cargo, airport-to-airport delivery, sea freight, relocation, and warehousing, we provide a one-stop solution for all your logistics needs.",
  },
  {
    title: "Global Reach, Local Care",
    description:
      "Whether it’s a small package or bulk cargo, our customized freight forwarding services ensure safe delivery across the globe with a personal touch.",
  },
  {
    title: "Customer-Centric Approach",
    description:
      "At Gulf Cargo, customer satisfaction is our top priority. Every shipment is handled with care, precision, and efficiency.",
  },
  {
    title: "Flexible & Reliable Services",
    description:
      "We offer express cargo, scheduled deliveries, customs clearance, storage, and packing solutions, tailored to suit different industries and businesses.",
  },
  {
    title: "Trusted by Businesses & Individuals",
    description:
      "Our long-standing relationships with corporates, SMEs, and individual clients are a testament to the quality and reliability we deliver.",
  },
  {
    title: "13+ Years of Expertise",
    description:
      "A proven track record in domestic and international cargo services, ensuring smooth and hassle-free deliveries every time.",
  },
];
  return (
    <>
        <section className="whychooseus">
            <div className="whychooseus-container container">
                <div className="whychooseus-flex grid grid-cols-1 lg:grid-cols-2 gap-15 lg:gap-12 xl:gap-16">
                    <div className="whychooseus-image relative">
                        <div className="sticky top-24">
                        <Image src="../Images/whychooseus.webp" width={1200} height={0} alt='Why Choose Us' priority />
                        </div>
                    </div>

                    <div className="whychooseus-content">
                        <h1 className="whychooseus-content-heading">Why Choose <span className='whychooseus-content-heading-highlight'>Gulf Cargo?</span></h1>
                        <p className='whychooseus-content-description'>At Gulf Cargo, we don’t just move shipments—we deliver trust, reliability, and satisfaction built over 13 years of experience in the cargo and logistics industry across the GCC. Our commitment to timely, secure, and cost-effective freight solutions makes us the preferred choice for businesses and individuals alike.</p>

                        <div className="whychooseus-points">
                            <div className="whychoooseus-point">
                                <h4 className="whychoooseus-point-heading">Here’s why our clients choose us:</h4>
                                    {whyChooseUs.map((point,index) => (
                                <div className="whychoooseus-point-list flex gap-3 p-2" key={index}>
                                    <div className="whychoooseus-point-list-icon">
                                        <FaSquareCheck/>
                                    </div>
                                     
                                    <div className="whychoooseus-point-list-content" key={index}>
                                        <h1 className='whychoooseus-point-list-heading'>{point.title}</h1>
                                        <p className='whychoooseus-point-list-description'>{point.description}</p>
                                    </div>
                                  
                                </div>
                                  ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </>
  )
}

export default WhyChooseUs