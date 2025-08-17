import React from 'react'
import ServicesBanner from '../components/services/ServicesBanner'
import AllServices from '../components/services/AllServices'
import ServiceIndustries from '../components/services/ServiceIndustries'
import Ctasection from '../components/home/ctasection'
import WhyChooseUs from '../components/services/WhyChooseUs'

const page = () => {
  return (
    <>
        <ServicesBanner/>
        <AllServices/>
        <ServiceIndustries/>
        <WhyChooseUs/>
        <Ctasection/>
    </>
  )
}

export default page