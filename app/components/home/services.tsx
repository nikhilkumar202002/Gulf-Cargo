"use client";

import React from "react";
import { motion } from "framer-motion";
import { servicesData } from "../data/servicesData";
import "./HomeStyles.css";
import { GoArrowUpRight } from "react-icons/go";
import Image from "next/image";

// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';

// Import required modules
import { Pagination, Autoplay } from 'swiper/modules';

const cardVariant = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const Services = () => {
  return (
    <>
      <section className="our-service">
        <div className="our-service-container container">
          <div className="our-service-header">
            <h1>Our Trusted Cargo & Logistics Services</h1>
            <p>
              From domestic to international freight, we deliver reliable, efficient, and customized logistics
              solutions across the GCC.
            </p>
          </div>

          <div className="our-service-wrapper">
            <Swiper
              modules={[Pagination, Autoplay]}
              spaceBetween={15}
              slidesPerView={1}
              loop={true}
              pagination={{ clickable: true, dynamicBullets: true }}
              autoplay={{
                delay: 3000,
                disableOnInteraction: false,
              }}
              breakpoints={{
                640: { slidesPerView: 2, spaceBetween: 20 },
                1024: { slidesPerView: 3, spaceBetween: 15 },
              }}
              className="mySwiper"
              style={{    
                paddingTop:"30px",
                paddingBottom: "60px", 

              }} 
            >
              {servicesData.map((service, index) => (
                <SwiperSlide key={index}>
                  <motion.div
                    className="our-service-card"
                    variants={cardVariant}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                    whileHover={{ y: -5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    style={{ height: "100%", display: "flex", flexDirection: "column" }} 
                  >
                    {/* The IMAGE container has overflow:hidden for the zoom effect */}
                    <div className="our-service-card-image">
                      <Image 
                        src={service.image} 
                        alt={service.title} 
                        width={500} 
                        height={300}
                        style={{ width: '100%', height: '100%' }}
                      />
                    </div>

                    <div className="our-service-card-header flex items-center gap-3">
                      <h1>{service.title}</h1>
                    </div>
                    <div className="our-service-card-descrption">
                      <p>{service.description}</p>
                    </div>
                    <div className="our-service-btn mt-auto">
                      <a href="#" className="flex items-center gap-2">
                        Read More <span><GoArrowUpRight /></span>
                      </a>
                    </div>
                  </motion.div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </section>
    </>
  );
};

export default Services;