import { Button } from '@radix-ui/themes';
import React from 'react';
import { servicesData } from "../data/servicesData";
import "./HomeStyles.css";
import Link from "next/link";

const services = () => {
  return (
    <>
        <section className="our-service">
            <div className="our-service-container container">
                <div className="our-service-header">
                    <h1>Our Trusted Cargo & Logistics Services</h1>
                    <p>From domestic to international freight, we deliver reliable, efficient, and customized logistics solutions across the GCC.</p>
                </div>

                <div className="our-service-wrapper">
                    <div className="our-service-cards grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        {servicesData.map((service, index) => (
                        <div className="our-service-card" key={index}>
                            <div className="our-service-card-header flex items-center gap-3">
                                <span>{service.icon}</span>
                                <h1>{service.title}</h1>
                            </div>
                            <div className="our-service-card-descrption">
                                <p>{service.description}</p>
                            </div>
                          
                        </div>
                         ))}
                    </div>
                </div>

                  <div className="our-service-card-btn">
                              
  <Link className='our-service-card-btn' href="/services" target="_blank" rel="noopener noreferrer">
    View More
  </Link>


                            </div>
            </div>
        </section>
    </>
  )
}

export default services