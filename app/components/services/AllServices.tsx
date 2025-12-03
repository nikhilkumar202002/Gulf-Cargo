"use client";

import Image from "next/image";
import React from "react";
import services from "../data/servicePageData";

type Service = {
  id?: number | string;
  anchor?: string;
  highlight: string;
  title: string;
  subtitle?: string;
  image: string;
  list?: string[];
  quote?: string;
};

const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");

const getAnchor = (service: Service) => {
  if (service.anchor) return service.anchor; // preferred (stable) anchor from data
  const base = service.highlight?.length ? service.highlight : service.title;
  return slugify(base);
};

const AllServices: React.FC = () => {
  return (
    <section className="allservices-main">
      <div className="allservices-container container">
        <div className="allservices-header">
          <h1 className="allservices-main-heading">
            Our <span className="allservices-main-heading-highlight">Core</span> Solutions
          </h1>
        </div>

        <div className="allservices relative">
          {services.map((service: Service, index: number) => {
            const anchor = getAnchor(service);
            return (
              <div
                id={anchor}
                key={service.id ?? anchor}
                className="allservices-flex grid grid-cols-1 md:grid-cols-2 gap-15 items-center sticky top-0 scroll-mt-24 md:scroll-mt-28"
              >
                <div className={index % 2 !== 0 ? "md:order-2" : "md:order-1"}>
                  <Image
                    src={service.image}
                    alt={service.highlight || service.title}
                    width={1200}
                    height={800}
                    className="h-auto w-full rounded-2xl"
                    sizes="(min-width: 768px) 50vw, 100vw"
                    priority={index === 0}
                  />
                </div>

                <div className={index % 2 !== 0 ? "md:order-1" : "md:order-2"}>
                  <h1 className="allservices-heading">
                    <span className="allservices-heading-highlight">{service.highlight}</span>{" "}
                    {service.title}
                  </h1>
                  {service.subtitle && (
                    <h4 className="allservice-sub-heading">{service.subtitle}</h4>
                  )}

                  {service.list?.length ? (
                    <ul className="allservices-list">
                      {service.list.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  ) : null}

                  {service.quote && <h3 className="allservice-quote">{service.quote}</h3>}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default AllServices;
