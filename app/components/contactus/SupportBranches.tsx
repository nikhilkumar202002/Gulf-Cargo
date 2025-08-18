import React from 'react'
import Branches from "../common/SupportBranchPlaces"

const SupportBranches = () => {
  return (
    <>
        <section className='support-branch'>
            <div className="support-branch-container container">
              <div className="support-branch-header">
                <h1 className='support-branch-heading'>Our Branch <span className='support-branch-heading-highlight'>Locations</span></h1>
              </div>
                <Branches/>
            </div>
        </section>
    </>
  )
}

export default SupportBranches