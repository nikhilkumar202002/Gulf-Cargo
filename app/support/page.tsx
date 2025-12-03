import React from 'react'
import SupportBanner from '../components/contactus/SupportBanner'
import SupportMap from '../components/contactus/SupportMap'
import SupportBranches from '../components/contactus/SupportBranches'
import SupportContactForm from '../components/contactus/contactus'

const page = () => {
  return (
    <>
        <SupportBanner/>
        <SupportMap/>
        <SupportBranches/>
        <SupportContactForm/>
    </>
  )
}

export default page