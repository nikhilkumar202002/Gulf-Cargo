'use client'
import React from 'react'
import "./HomeStyles.css";
import { RiDoubleQuotesR } from "react-icons/ri";
import Image from 'next/image';
import { useState, useEffect } from 'react';
import styles from './TestimonialCarousel.module.css';

const testomonials = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
      const [isMobile, setIsMobile] = useState(false);

     const testimonials = [
    {
      id: 1,
      content: "Gulf Cargo has been our go-to logistics partner for years. Their team is professional, responsive, and always delivers on time.",
      avatar: "/Images/avatar-1.jpg",
      client: "Mohammed A., Dubai"
    },
    {
      id: 2,
      content: "Exceptional service quality and reliability. Gulf Cargo handles our shipments with utmost care and precision.",
      avatar: "/Images/avatar-2.jpg",
      client: "Sarah K., Abu Dhabi"
    },
    {
      id: 3,
      content: "Outstanding logistics solutions. Their customer support is fantastic and they always go above and beyond.",
      avatar: "/Images/avatar-3.jpg",
      client: "Ahmed R., Sharjah"
    },
    {
      id: 4,
      content: "Reliable, efficient, and cost-effective. Gulf Cargo has streamlined our supply chain operations significantly.",
      avatar: "/Images/avatar-4.jpg",
      client: "Lisa M., Dubai"
    },
    {
      id: 5,
      content: "Professional team with excellent communication. They make complex logistics seem effortless.",
      avatar: "/Images/avatar-5.jpg",
      client: "Omar H., Ras Al Khaimah"
    },
    {
      id: 6,
      content: "Top-notch service with competitive pricing. Gulf Cargo consistently exceeds our expectations.",
      avatar: "/Images/avatar-6.jpg",
      client: "Emma J., Fujairah"
    }
  ];


  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);

    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  // Calculate cards per slide and total slides based on screen size
  const cardsPerSlide = isMobile ? 1 : 3;
  const totalSlides = Math.ceil(testimonials.length / cardsPerSlide);

  // Auto-play functionality
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % totalSlides);
    }, 5000);

    return () => clearInterval(interval);
  }, [totalSlides]);

  const handleDotClick = (index) => {
    setCurrentIndex(index);
  };

  return (
    <>
        <section className="testimonial-section">
            <div className="testimonial-container container">
                <div className="testimonial-header">
                    <h1 className='testimonial-heading'>What Our Clients Say</h1>
                    <p className="testimonial-description">Trusted by businesses and individuals across the GCC for reliable, on-time deliveries.</p>
                </div>
                
                 <div className={styles.testimonialWrapper}>
      <div className={styles.testimonialContainer}>
        <div 
          className={styles.testimonialCards}
          style={{
            transform: `translateX(-${currentIndex * 100}%)`,
          }}
        >
          {Array.from({ length: totalSlides }, (_, slideIndex) => (
            <div key={slideIndex} className={styles.slide}>
              {testimonials
                .slice(slideIndex * cardsPerSlide, (slideIndex + 1) * cardsPerSlide)
                .map((testimonial) => (
                  <div key={testimonial.id} className={styles.testimonialCard}>
                    <div className={styles.testimonialCollon}>
                      <RiDoubleQuotesR />
                    </div>
                    <div className={styles.testimonialContent}>
                      <p>{testimonial.content}</p>
                    </div>
                    <div className={styles.testimonialAvatar}>
                      <Image 
                        src={testimonial.avatar} 
                        alt="avatar" 
                        width={60} 
                        height={60}
                        className={styles.avatarImage}
                      />
                      <p className={styles.testimonialClient}>{testimonial.client}</p>
                    </div>
                  </div>
                ))}
            </div>
          ))}
        </div>
      </div>

      {/* Dot Pagination */}
      <div className={styles.dotPagination}>
        {Array.from({ length: totalSlides }, (_, index) => (
          <button
            key={index}
            className={`${styles.dot} ${currentIndex === index ? styles.activeDot : ''}`}
            onClick={() => handleDotClick(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
            </div>
        </section>
    </>
  )
}

export default testomonials