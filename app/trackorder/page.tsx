"use client"

import TrackingJourney from '../components/trackingpage/TrackingJourney';
import TrackpageBanner from '../components/trackingpage/TrackpageBanner';
import Trackorder from '../components/trackingpage/Trackorder';

const page = () => {
  return (
    <>
        <TrackpageBanner/>
        <Trackorder/>
        <TrackingJourney/>
    </>
  )
}

export default page