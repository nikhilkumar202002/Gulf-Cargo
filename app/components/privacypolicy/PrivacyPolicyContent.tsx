import React from 'react';
import Link from 'next/link';
import "./PrivacyStyles.css";

const PrivacyPolicyContent = () => {
    return (
        <>
            <section className="privacy-policy">
                <div className="privacy-policy-container container">
                    <div className="privacy-policy-header">
                        <h2 className='privacy-policy-heading'>Privacy Policy</h2>
                        <p>At *Gulf Cargo KSA*, we value your trust and are committed to protecting your personal information. This Privacy Policy explains how we collect, use, and safeguard your data when you use our website and logistics services.</p>

                        <h2 className='privacy-policy-sub-heading'>Information We Collect</h2>
                        <ul>
                            <li>Name, contact details, and address</li>
                            <li>Shipment and cargo details</li>
                            <li>Payment and billing information (handled securely)</li>
                            <li>Technical data such as IP address and browser type</li>
                        </ul>

                        <h2 className='privacy-policy-sub-heading'>How We Use Your Information</h2>
                        <ul>
                            <li>To process and deliver shipments</li>
                            <li>To provide shipment tracking and customer support</li>
                            <li>To comply with customs and regulatory requirements</li>
                            <li>To improve our services and website performance</li>
                        </ul>

                        <h2 className='privacy-policy-sub-heading'>Data Sharing</h2>
                        <h4 className='privacy-policy-sub-heading-one'>We may share your data with:</h4>

                        <ul>
                            <li>Shipping partners, carriers, and customs authorities</li>
                            <li>Payment processors for secure transactions</li>
                            <li>Legal authorities where required by law</li>
                        </ul>

                        <h2 className='privacy-policy-sub-heading'>We never sell or rent your personal data to third parties.</h2>
                        <h4 className='privacy-policy-sub-heading-one'>Security</h4>
                        <p>We use secure servers and encryption methods to protect your data. However, no method of transmission over the Internet is 100% secure.</p>

                        <h4 className='privacy-policy-sub-heading-one'>Cookies</h4>
                        <p>Our website may use cookies to improve your browsing experience. You can manage cookie preferences in your browser settings.</p>

                        <h2 className='privacy-policy-sub-heading'>Your Rights</h2>
                        <h4 className='privacy-policy-sub-heading-one'>You can request to:</h4>

                        <ul>
                            <li>Access, update, or correct your information</li>
                            <li>Delete your personal data (subject to legal obligations)</li>
                            <li>Opt out of marketing communications</li>
                        </ul>

                        <h2 className='privacy-policy-sub-heading'>Contact Us</h2>
                        <h4 className='privacy-policy-sub-heading-one'>For questions about this Privacy Policy, please contact:</h4>

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

export default PrivacyPolicyContent