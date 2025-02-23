// import { faAngleRight } from '@fortawesome/free-solid-svg-icons'
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import '../../CSS/CustomerCSS/CustomerCheckOut.css'
// import CustomerTopFooterComponent from '../../components/CustomerComponents/CustomerTopFooterComponent';
// import CustomerFooterComponent from '../../components/CustomerComponents/CustomerFooterComponent';
// import { useLocation, useNavigate, useParams } from 'react-router-dom';
// import CustomerCashOnDeliveryPaymentMethod from '../../components/CustomerComponents/CustomerCheckout/CustomerCashOnDeliveryPaymentMethod';
// import CustomerGcashPaymentMethod from '../../components/CustomerComponents/CustomerCheckout/CustomerGcashPaymentMethod';
// import UseDirectCheckOutHook from '../../hooks/CustomerHooks/UseDirectCheckOutHook';
// import { useContext } from 'react';
// import { CustomerContext } from '../../../contexts/CustomerContexts/CustomerAuthContext';

// function CustomerDirectCheckOutPage() {
//     const navigate = useNavigate();
//     const {customer} = useContext(CustomerContext);
//     const {customerId} = useParams();
//     const location = useLocation();
//     const selectedItems = location.state?.selectedItems || location.state?.cartItems || [];

//     const {
//         billingDetails,
//         paymentMethod,
//         total,
//         showCashOnDeliveryModal,
//         showGcashModal,
//         handleInputChange,
//         handlePaymentChange,
//         handleGcashPayment,
//         handleSetPartialPayment,
//         handlePlaceOrder,
//         setShowCashOnDeliveryModal,
//         setShowGcashModal,
//     } = UseDirectCheckOutHook(customerId, selectedItems, navigate);

//   return (
//     <div>
//         <div className='customer-checkout-header'>
//             <h1>Checkout</h1>
//             <h6>
//                 <span>Home</span>
//                 <FontAwesomeIcon icon={faAngleRight} />
//                 <span>Checkout</span>
//             </h6>
//         </div>

//         <form className='customer-checkout-content' onSubmit={(e) => { e.preventDefault(); handlePlaceOrder(); }}>
//             <div className='billing-details'>
//                 <h2>Billing details</h2>
//                 <div className='form-group'>
//                     <div className='form-control'>
//                         <label>First Name</label>
//                         <input
//                         type="text"
//                         name="firstName"
//                         value={billingDetails.firstName}
//                         onChange={handleInputChange}
//                         />
//                     </div>
//                     <div className='form-control'>
//                         <label>Last Name</label>
//                         <input
//                         type="text"
//                         name="lastName"
//                         value={billingDetails.lastName}
//                         onChange={handleInputChange}
//                         />
//                     </div>
//                     <div className='form-control'>
//                         <label>Middle Name</label>
//                         <input
//                         type="text"
//                         name="middleInitial"
//                         value={billingDetails.middleInitial}
//                         onChange={handleInputChange}
//                         />
//                     </div>
//                 </div>
//                 <div className='form-group'>
//                     <div className='form-control'>
//                         <label>Province</label>
//                         <input
//                         type="text"
//                         name="province"
//                         value={billingDetails.province}
//                         onChange={handleInputChange}
//                         />
//                     </div>
//                     <div className='form-control'>
//                         <label>City</label>
//                         <input
//                         type="text"
//                         name="city"
//                         value={billingDetails.city}
//                         onChange={handleInputChange}
//                         />
//                     </div>
//                     <div className='form-control'>
//                         <label>Barangay</label>
//                         <input
//                         type="text"
//                         name="barangay"
//                         value={billingDetails.barangay}
//                         onChange={handleInputChange}
//                         />
//                     </div>
//                 </div>
//                 <div className='form-group'>
//                     <div className='form-control'>
//                         <label>Purok/Street/Subdivision</label>
//                         <input
//                         type="text"
//                         name="purokStreetSubdivision"
//                         value={billingDetails.purokStreetSubdivision}
//                         onChange={handleInputChange}
//                         />
//                     </div>
//                     <div className='form-control'>
//                         <label>Contact Number</label>
//                         <input
//                         type="text"
//                         name="contactNumber"
//                         value={billingDetails.contactNumber}
//                         onChange={handleInputChange}
//                         />
//                     </div>
//                     <div className='form-control'>
//                         <label>Client Type</label>
//                         <input
//                         type="text"
//                         name="clientType"
//                         value={billingDetails.clientType}
//                         onChange={handleInputChange}
//                         readOnly
//                         />
//                     </div>
//                 </div>
//                 <div className='form-control'>
//                     <label>Email address</label>
//                     <input
//                     type='email'
//                     name="emailAddress"
//                     value={billingDetails.emailAddress}
//                     onChange={handleInputChange}
//                     />
//                 </div>
//             </div>




//             <div className='order-summary'>
//                 <div className='order-summary-title'>
//                     <h3>Product</h3>
//                     <h3>Subtotal</h3>
//                 </div>
//                 {
//                     selectedItems.map((item, index) => (
//                         <div key={index} className='order-items-subtotal'>
//                             <p>{`${item.productId.productName} x ${item.quantity}`}</p>
//                             <p>{`₱ ${
//                                 (customer?.isNewCustomer && new Date(customer?.newCustomerExpiresAt) > new Date()
//                                     ? item.productId.price * 0.7
//                                     : item.discountedPrice || item.productId.discountedPrice
//                                 ).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
//                             }`}</p>
//                         </div>
//                     ))
//                 }
//                 <div className='order-total'>
//                     <div className='subtotal'>
//                         <span>Subtotal</span>
//                         <span>{`₱ ${total.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`}</span>
//                     </div>
//                     <div className='shipping'>
//                         <span>Shipping</span>
//                         <span>50</span>
//                     </div>
//                     <div className='total'>
//                         <span>Total</span>
//                         <span>{`₱ ${(total + 50).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`}</span>
//                     </div>
//                 </div>

//                 <div className='payment-method'>
//                     <label>
//                         <input
//                         type="radio"
//                         name='payment'
//                         value="Gcash"
//                         checked={paymentMethod === 'Gcash'}
//                         onChange={handlePaymentChange}
//                         />
//                         <span>Gcash</span>
//                         <p>
//                             Make your payment directly into our Gcash account. Please use your Reference ID as the payment reference. Your order will not be shipped until the funds have cleared in our account.
//                         </p>
//                     </label>
//                     <label>
//                         <input
//                         type="radio"
//                         name='payment'
//                         value="Cash On Delivery"
//                         checked={paymentMethod === 'Cash On Delivery'}
//                         onChange={handlePaymentChange}
//                         />
//                         <span>Cash On Delivery</span>
//                         <p>
//                             Your personal data will be used to support your experience throughout this website, to manage access to your account, and for other purposes described in our privacy policy.
//                         </p>
//                     </label>
//                 </div>
//                 <div className='place-order-button'>
//                     <button className={`place-order ${!paymentMethod ? 'disabled' : ''}`}
//                     disabled={!paymentMethod} 
//                     >
//                         Place order
//                     </button>
//                 </div>
//             </div>
//         </form>

//         {
//             showCashOnDeliveryModal && (
//                 <CustomerCashOnDeliveryPaymentMethod
//                 onClose={() => setShowCashOnDeliveryModal(false)}
//                 onSetPartialPayment={handleSetPartialPayment}
//                 defaultPartialAmount={((total + 50) * 0.2).toFixed(2)}
//                 partialAmount={(total + 50).toFixed(2)}
//                 />
//             )
//         }

//         {
//             showGcashModal && (
//                 <CustomerGcashPaymentMethod 
//                 onClose={() => setShowGcashModal(false)} 
//                 onGcashPayment={handleGcashPayment}
//                 defaultGcashPaid={(total + 50).toFixed(2)}
//                 />
//             )
//         }

//         <CustomerTopFooterComponent />
        
//         <CustomerFooterComponent />
//     </div>
//   )
// }

// export default CustomerDirectCheckOutPage

import { faAngleRight } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import '../../CSS/CustomerCSS/CustomerCheckOut.css'
import CustomerTopFooterComponent from '../../components/CustomerComponents/CustomerTopFooterComponent';
import CustomerFooterComponent from '../../components/CustomerComponents/CustomerFooterComponent';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import UseCheckOutHook from '../../hooks/CustomerHooks/UseCheckOutHook';
import { useContext, useState } from 'react';
import { CustomerContext } from '../../../contexts/CustomerContexts/CustomerAuthContext';
import CustomerPickUpPaymentMethod from '../../components/CustomerComponents/CustomerCheckout/CustomerPickUpPaymentMethod';
import UseDirectCheckOutHook from '../../hooks/CustomerHooks/UseDirectCheckOutHook';

function CustomerDirectCheckOutPage() {
    const navigate = useNavigate();
    const {customer} = useContext(CustomerContext);
    const {customerId} = useParams();
    const location = useLocation();
    const selectedItems = location.state?.selectedItems || location.state?.cartItems || [];
    const [isTermsAccepted, setIsTermsAccepted] = useState(false);

    const {
        billingDetails,
        paymentMethod,
        total,
        showPickupModal,
        handleInputChange,
        handlePaymentChange,
        handlePickupPayment,
        handlePlaceOrder,
        setShowPickupModal,
        selectedDate,
        selectedTime,
        setSelectedDate,
        setSelectedTime,
    } = UseDirectCheckOutHook(customerId, selectedItems, navigate);
    console.log('Selected Items:', selectedItems);

    const handleTermsChange = (e) => {
        setIsTermsAccepted(e.target.checked);
    };
  return (
    <div>
        <div className='customer-checkout-header'>
            <h1>Checkout</h1>
            <h6>
                <span>Home</span>
                <FontAwesomeIcon icon={faAngleRight} />
                <span>Checkout</span>
            </h6>
        </div>

        <form 
        className='customer-checkout-content' 
        onSubmit={(e) => { 
            e.preventDefault();
            handlePlaceOrder(); }
        }>
            <div className='billing-details'>
                <h2>Billing details</h2>
                <div className='form-group'>
                    <div className='form-control'>
                        <label>First Name</label>
                        <input
                        type="text"
                        name="firstName"
                        value={billingDetails.firstName}
                        onChange={handleInputChange}
                        />
                    </div>
                    <div className='form-control'>
                        <label>Last Name</label>
                        <input
                        type="text"
                        name="lastName"
                        value={billingDetails.lastName}
                        onChange={handleInputChange}
                        />
                    </div>
                    <div className='form-control'>
                        <label>Middle Name</label>
                        <input
                        type="text"
                        name="middleInitial"
                        value={billingDetails.middleInitial}
                        onChange={handleInputChange}
                        />
                    </div>
                </div>
                <div className='form-group'>
                    <div className='form-control'>
                        <label>Province</label>
                        <input
                        type="text"
                        name="province"
                        value={billingDetails.province}
                        onChange={handleInputChange}
                        />
                    </div>
                    <div className='form-control'>
                        <label>City</label>
                        <input
                        type="text"
                        name="city"
                        value={billingDetails.city}
                        onChange={handleInputChange}
                        />
                    </div>
                    <div className='form-control'>
                        <label>Barangay</label>
                        <input
                        type="text"
                        name="barangay"
                        value={billingDetails.barangay}
                        onChange={handleInputChange}
                        />
                    </div>
                </div>
                <div className='form-group'>
                    <div className='form-control'>
                        <label>Purok/Street/Subdivision</label>
                        <input
                        type="text"
                        name="purokStreetSubdivision"
                        value={billingDetails.purokStreetSubdivision}
                        onChange={handleInputChange}
                        />
                    </div>
                    <div className='form-control'>
                        <label>Contact Number</label>
                        <input
                        type="text"
                        name="contactNumber"
                        value={billingDetails.contactNumber}
                        onChange={handleInputChange}
                        />
                    </div>
                    <div className='form-control'>
                        <label>Client Type</label>
                        <input
                        type="text"
                        name="clientType"
                        value={billingDetails.clientType}
                        onChange={handleInputChange}
                        readOnly
                        />
                    </div>
                </div>
                <div className='form-control'>
                    <label>Email address</label>
                    <input
                    type='email'
                    name="emailAddress"
                    value={billingDetails.emailAddress}
                    onChange={handleInputChange}
                    />
                </div>
            </div>




            <div className='order-summary'>
                <div className='order-summary-title'>
                    <h3>Product</h3>
                    <h3>Subtotal</h3>
                </div>
                {
                    selectedItems.map((item, index) => (
                        <div key={index} className='order-items-subtotal'>
                            <p>{`${item.productId.productName} x ${item.quantity}`}</p>
                            <p>{`₱ ${
                                (customer?.isNewCustomer && new Date(customer?.newCustomerExpiresAt) > new Date()
                                    ? item.productId.price * 0.7
                                    : item.discountedPrice || item.productId.discountedPrice
                                ).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})
                            }`}</p>
                        </div>
                    ))
                }
                <div className='order-total'>
                    <div className='subtotal'>
                        <span>Subtotal</span>
                        <span>{`₱ ${total.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`}</span>
                    </div>
                    <div className='total'>
                        <span>Total</span>
                        <span>{`₱ ${(total).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`}</span>
                    </div>
                </div>

                <div className='payment-method'>
                    {
                        customer && ['Individual'].includes(customer.clientType) && (
                            <>
                                <label>
                                    <input
                                    type="radio"
                                    name='payment'
                                    value="Pick Up"
                                    checked={paymentMethod === 'Pick Up'}
                                    onChange={handlePaymentChange}
                                    onClick={handlePaymentChange}
                                    />
                                    <span>Pick Up</span>
                                    <p>
                                        {
                                        selectedDate && selectedTime 
                                            ? `You have selected ${new Date(selectedDate).toLocaleDateString(undefined, {
                                                weekday: "long", year: "numeric", month: "long", day: "numeric"})} 
                                            from ${selectedTime}`
                                            : 'Select a pick-up date and time'
                                        }
                                    </p>
                                </label>
                            </>
                        )
                    }
                    {
                        customer && ['Wholesaler'].includes(customer.clientType) && (
                            <>
                                <label>
                                    <input
                                    type="radio"
                                    name='payment'
                                    value="Cash On Delivery"
                                    checked={paymentMethod === 'Cash On Delivery'}
                                    onChange={handlePaymentChange}
                                    />
                                    <span>Cash On Delivery</span>
                                
                                </label>
                                <p>
                                    {
                                        total < 50000 && paymentMethod === 'Cash On Delivery' && (
                                            <span className='error-message'>
                                                Total amount must be at least ₱50,000+ for Cash On Delivery.
                                            </span>
                                        )
                                    }
                                </p>
                            </>
                        )
                    }
                </div>

                <div className='payment-method'>
                    <label>
                        <input
                            type="checkbox"
                            name="terms"
                            checked={isTermsAccepted}
                            onChange={handleTermsChange}
                        />
                        <span>Terms and Conditions</span>
                        <p>I have read and accept the 
                            <Link style={{ color: 'black', fontWeight: 'bold' }} to="/terms-and-conditions"> Terms and Conditions</Link>.
                        </p>
                        
                    </label>
                </div>


                <div className='place-order-button'>
                    
                   <div className='place-order-button'>
                        <button
                            className={`place-order ${
                                (!paymentMethod || 
                                (paymentMethod === 'Cash On Delivery' && total < 50000) || 
                                (paymentMethod === 'Pick Up' && (!selectedDate || !selectedTime)) ||
                                !isTermsAccepted) ? 'disabled' : ''
                            }`}
                            disabled={
                                !paymentMethod || 
                                (paymentMethod === 'Cash On Delivery' && total < 50000) || 
                                (paymentMethod === 'Pick Up' && (!selectedDate || !selectedTime)) ||
                                !isTermsAccepted
                            }
                        >
                            Place Order
                        </button>
                    </div>
                </div>
            </div>
        </form>


        {
            showPickupModal && (
                <CustomerPickUpPaymentMethod
                    onClose={() => setShowPickupModal(false)}
                    selectedDate={selectedDate}
                    selectedTime={selectedTime}
                    setSelectedDate={setSelectedDate}
                    setSelectedTime={setSelectedTime}
                    handlePickupPayment={handlePickupPayment}
                    setShowPickupModal={setShowPickupModal}
                />
            )
        }

        <CustomerTopFooterComponent />
        
        <CustomerFooterComponent />
    </div>
  )
}

export default CustomerDirectCheckOutPage