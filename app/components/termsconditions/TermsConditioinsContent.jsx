import React from 'react';
import "./TermsConditionsStyles.css";
import Link from 'next/link';

const TermsConditioinsContent = () => {
  return (
    <>
         <section className="terms-conditions">
                        <div className="terms-conditions-container container">
                            <div className="terms-conditions-header">
                                <h2 className='terms-conditions-heading'>Terms & Conditions</h2>
                                <p>Welcome to *Gulf Cargo KSA*. By using our website and logistics services, you agree to the following terms and conditions. Please read them carefully.</p>
        
                                <h2 className='terms-conditions-sub-heading'>Services</h2>
                                <p>We provide cargo, shipping, and logistics solutions within Saudi Arabia and internationally. Services are subject to availability, regulations, and operational conditions.</p>
        
                                <h2 className='terms-conditions-sub-heading'>Customer Responsibilities</h2>
                                <ul>
                                    <li>Provide accurate shipment and contact information</li>
                                    <li>Ensure shipments comply with customs rules and are not restricted items</li>
                                    <li>Pay all service charges, duties, and taxes as required</li>
                                </ul>
        
                                <h2 className='terms-conditions-sub-heading'>Prohibited Items</h2>
                                <h4 className='terms-conditions-sub-heading-one'>We do not handle goods restricted by Saudi law, including:</h4>
        
                                <ul>
                                    <li>Illegal drugs or controlled substances</li>
                                    <li>Weapons, explosives, or hazardous items</li>
                                    <li>Counterfeit or fraudulent goods</li>
                                    <li>Restricted cultural, religious, or prohibited materials</li>
                                </ul>
        
                                <h2 className='terms-conditions-sub-heading'>Liability</h2>
                                <ul>
                                    <li>Gulf Cargo KSA is not responsible for delays due to customs, weather, or government regulations</li>
                                    <li>Limited liability applies to loss or damage, in line with shipping standards and insurance coverage (if purchased)</li>
                                </ul>
        
                                <h4 className='terms-conditions-sub-heading-one'>Shipment Tracking</h4>
                                <p>Tracking information provided on our website is for guidance and may vary depending on carriers.</p>
        
                                <h2 className='terms-conditions-sub-heading'>Suspension or Termination</h2>
                                <p>These Terms & Conditions are governed by the laws of the *Kingdom of Saudi Arabia*.</p>
        
                                 <h2 className='terms-conditions-sub-heading'>Updates</h2>
                                <p>We may revise these terms from time to time. Continued use of our services means you accept the updated terms.</p>
        
                                <h2 className='terms-conditions-sub-heading'>Contact Us</h2>
                                <h4 className='terms-conditions-sub-heading-one'>For questions about this Privacy Policy, please contact:</h4>
        
                                  <ul>
                                    <li><Link href="maito:info@gulfcargoksa.com">info@gulfcargoksa.com</Link></li>
                                    <li><Link href="tel:966547619393">+966 54 761 9393</Link></li>
                                </ul>
        
                            </div>
                        </div>
                    </section>
    </>
  )
}

export default TermsConditioinsContent