"use client"

import OrderForm from "./OrderForm"
import Faq from "./Faq"

const Trackorder = () => {
  return (
    <>
        <section className="track-order">
            <div className="track-order-container container py-20">
                <div className="track-order-flex grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-8">
                    <div className="track-order-form-faq">
                        <OrderForm/>
                        <Faq/>
                    </div>
                </div>
            </div>
        </section>
    </>
  )
}

export default Trackorder