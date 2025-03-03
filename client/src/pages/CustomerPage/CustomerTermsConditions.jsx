import React, { useContext } from 'react'
import '../../CSS/CustomerCSS/CustomerTermsConditions.css';
import vectorLeft from '../../assets/vectors/login-vector-left.png';
import vectorRight from '../../assets/vectors/login-vector-right.png';
import { Link, useNavigate } from 'react-router-dom';
import arrowLeft from '../../assets/icons/arrow-right.png';

function CustomerTermsConditions() {
    const navigate = useNavigate();

  return (
    <>
        <div className='terms-container'>
            <div className='term-condition-header-left'>
                <button onClick={() => navigate(-1)} className='icon-angle-link'>
                    <img src={arrowLeft} alt='Arrow Left' className='icon-angle' />
                </button>
            </div>
            <div>
                <h1>Terms and Conditions</h1>
                <section>
                    <h2>1. Definitions</h2>
                    <p><strong>"Individual"</strong> refers to any individual purchasing products from Sabon Depot or picking up products in the Sabon Depot.</p>
                    <p><strong>“Wholesaler”</strong> refers to a customer who buys products in bulk through online transactions and has a connection with Sabon Depot.</p>
                    <p><strong>"Products"</strong> refer to all cleaning and hygiene-related items sold by Sabon Depot.</p>
                </section>

                <section>
                    <h2>2. Product Information & Availability</h2>
                    <ul>
                    <li>All product descriptions, images, and prices are subject to change without notice.</li>
                    <li>We strive to ensure product availability, but we do not guarantee stock at all times.</li>
                    <li>Product effectiveness may vary depending on use; always follow instructions on the packaging.</li>
                    </ul>
                </section>

                <section>
                    <h2>3. Ordering & Payment</h2>
                    <ul>
                    <li>Orders can be placed through our website or in-store.</li>
                    <li>Payment can be done through Cash-on-Delivery or at the counter.</li>
                    <li>Prices are subject to change without prior notice.</li>
                    <li>Discounts are only valid during the specified promotional period and cannot be applied retroactively.</li>
                    </ul>
                </section>

                <section>
                    <h2>4. Shipping & Delivery</h2>
                    <p>Delivery times vary based on location. Estimated shipping times will be provided at checkout.</p>
                </section>

                <section>
                    <h2>5. Returns & Refunds</h2>
                    <ul>
                    <li>Only defective or damaged items may be returned depending on the location.</li>
                    <li>Returns must be in their original packaging and accompanied by proof of purchase.</li>
                    <li>Refunds will be processed after inspection and may take a week or depending on the location.</li>
                    </ul>
                </section>

                <section>
                    <h2>6. Warranty & Liability</h2>
                    <ul>
                    <li>Our products are sold "as is" and are not covered by a warranty unless otherwise stated.</li>
                    <li>Sabon Depot is not liable for any misuse of products leading to damage or injury.</li>
                    </ul>
                </section>

                <section>
                    <h2>7. Intellectual Property</h2>
                    <ul>
                    <li>All trademarks, logos, and product designs are the property of Sabon Depot.</li>
                    <li>Unauthorized use of our intellectual property is prohibited.</li>
                    </ul>
                </section>

                <section>
                    <h2>8. Privacy Policy</h2>
                    <ul>
                    <li>Customer information is handled in accordance with our Privacy Policy.</li>
                    <li>We do not sell or share personal data with third parties without consent.</li>
                    </ul>
                </section>

                <section>
                    <h2>9. Changes to Terms</h2>
                    <ul>
                    <li>Sabon Depot reserves the right to update these Terms and Conditions at any time.</li>
                    <li>Continued use of our products or website constitutes acceptance of any updates.</li>
                    </ul>
                </section>
            </div>
            </div>
        <div className='customer-terms-vectors'>
            <img src={vectorLeft} className='vector-left' alt="" />
            <img src={vectorRight} className='vector-right' alt="" />
        </div>
    </>
  )
}

export default CustomerTermsConditions
