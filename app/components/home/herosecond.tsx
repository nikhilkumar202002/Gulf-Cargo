import React from 'react'
import { heroFeaturesData } from "../data/heroFeaturesData";

const herosecond = () => {
  return (
    <>
        <section className="hero-second">
            <div className="hero-second-container container">
                <div className="hero-second-row grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
                    {heroFeaturesData.map((feature, index) => (
                    <div className="hero-second-col" key={index}>
                        <div className="hero-second-items flex items-start gap-2"  >
                            <div className="hero-second-icon">
                                {feature.icon}
                            </div>
                            <div className="hero-second-content">
                                <h1>{feature.title}</h1>
                                <p>{feature.description}</p>
                            </div>
                        </div>
                    </div>

                     ))}
                </div>
                
            </div>
        </section>
    </>
  )
}

export default herosecond