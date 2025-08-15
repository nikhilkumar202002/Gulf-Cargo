import React from 'react'
import ContactGrid from '../common/ContactGrid'

const CoperativeLocations = () => {
  return (
    <>
        <section className="coperative-locations">
            <div className="coperative-locations-container container">
                <div className="coperative-locations-header">
                    <h1 className="coperative-loactions-heading">
                        <span className='coperative-loactions-highlight'>Key Corporate locations</span> across the country
                    </h1>
                </div>

                <div className="coperative-locations-grid">
                    <ContactGrid/>
                </div>
            </div>
        </section>
    </>
  )
}

export default CoperativeLocations