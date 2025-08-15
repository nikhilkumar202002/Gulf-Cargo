import React from 'react'
import AboutBanner from '../components/about/AboutBanner'
import AboutContent from '../components/about/AboutContent'
import MissionVision from '../components/about/MissionVision'
import CoperativeLocations from '../components/about/CoperativeLocations'

const page = () => {
  return (
    <>
        <AboutBanner/>
        <AboutContent/>
        <MissionVision/>
        <CoperativeLocations/>
    </>
  )
}

export default page