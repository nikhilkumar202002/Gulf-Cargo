import React from 'react'

const ServiceIndustries = () => {

    const industries = [
  {
    title: "Oil & Gas",
    description:
      "Specialized handling of petroleum products, drilling equipment, and offshore logistics with strict safety protocols and regulatory compliance.",
  },
  {
    title: "Construction & Infrastructure",
    description:
      "Project cargo management for construction materials, heavy machinery, and infrastructure development across the Gulf region.",
  },
  {
    title: "Manufacturing & Industrial",
    description:
      "Supply chain solutions for automotive, electronics, machinery, and industrial equipment with just-in-time delivery capabilities.",
  },
  {
    title: "Food & Beverages",
    description:
      "Temperature-controlled logistics for perishables, food products, and beverages with HACCP-compliant facilities.",
  },
  {
    title: "Pharmaceuticals & Healthcare",
    description:
      "GDP-certified cold chain logistics for pharmaceutical products, medical devices, and healthcare supplies.",
  },
  {
    title: "Retail & E-commerce",
    description:
      "Fulfillment services, inventory management, and last-mile delivery for retail and e-commerce businesses.",
  },
];

    return (
        <>
            <section className='service-industries'>
                <div className="service-industries-container container">
                    <div className="service-industries-flex grid grid-cols-1 lg:grid-cols-10 gap-8 items-start">
                        <div className="service-industries-col lg:col-span-3">
                            <div className="service-industries-content">
                                <h1 className='service-industries-content-heading'><span className='service-industries-content-heading-highlight'>Industry</span> Expertise</h1>
                            </div>
                        </div>

                        <div className="service-industries-col lg:col-span-7">
                            <div className="service-industries-grids grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {industries.map((industry, index) => (
                                <div key={index} className="service-industries-grid border border-dashed border-gray-500 bg-[#111111] rounded-lg p-6">
                                    <h3 className="service-industries-grid-heading">{industry.title}</h3>
                                    <p className="service-industries-grid-description">
                                        {industry.description}
                                    </p>
                                </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default ServiceIndustries