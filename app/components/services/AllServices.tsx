"use client";

import Image from 'next/image'
import React from 'react'
import services from "../data/servicePageData";

const AllServices = () => {
  return (
    <>
        <section className="allservices-main ">
            <div className="allservices-container container">
                <div className="allservices-header">
                    <h1 className='allservices-main-heading'>Our <span className='allservices-main-heading-highlight'>Core</span> Solutions</h1>
                </div>
                <div className="allservices relative">
                    {services.map((service, index) => (
                    <div className="allservices-flex grid grid-cols-1 md:grid-cols-2 gap-15 items-center sticky top-0 " key={service.id}>
                        <div className={`allservices-image  ${
                  index % 2 !== 0 ? "md:order-2" : "md:order-1"
                }`}>
                            <Image width={1200} height={0} src={service.image}
                  alt={service.highlight}/>
                        </div>

                        <div className={`allservices-content ${
                  index % 2 !== 0 ? "md:order-1" : "md:order-2"
                }`}>
                            <h1 className="allservices-heading"><span className='allservices-heading-highlight'>{service.highlight}</span> {service.title}</h1>
                            <h4 className='allservice-sub-heading'>{service.subtitle}</h4>
                            <ul className='allservices-list'>
                                {service.list.map((item, i) => (
                                        <li key={i}>{item}</li>
                                    ))}
                            </ul>
                            <h3 className='allservice-quote'>{service.quote}</h3>
                        </div>
                    </div>
                      ))}
                </div>
            </div>
        </section>
    </>
  )
}

export default AllServices