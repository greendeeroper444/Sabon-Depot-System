import React, { useState } from 'react'
import '../../../CSS/CustomerCSS/CustomerCheckout/CustomerCashOnDeliveryPaymentMethod.css';
import { toast } from 'react-hot-toast';

const CustomerCashOnDeliveryPaymentMethod = ({onClose, defaultPartialAmount, totalAmount = 0}) => {
    const [partialPayment, setPartialPayment] = useState(defaultPartialAmount || '');
    const minimumPartialPayment = 5000;

    const handlePartialPaymentChange = (e) => {
        //remove non-numeric characters before parsing
        const value = parseFloat(e.target.value.replace(/[^0-9.-]+/g, '')) || 0;
        setPartialPayment(value);
    };

    const handleSubmit = () => {
        toast.success('Submitted successfully! Please place your order.');
        onClose();
    };

    const remainingAmount = totalAmount - (partialPayment || 0);
    const isValidPartialPayment = partialPayment >= minimumPartialPayment;

    //format partial payment with commas
    const formattedPartialPayment = partialPayment.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });

  return (
    <div className='customer-cod-payment-container'>
        <div className='customer-cod-payment-content'>
            <h2>Cash On Delivery</h2>
            <p>₱{defaultPartialAmount}</p>
            {
                !isValidPartialPayment && (
                <p className='error-message-payment'>Total amount must be at least ₱50,000+.</p>
                )
            }

            <div className='modal-buttons'>
                <button className='cancel-button' onClick={onClose}>
                    Cancel
                </button>
                <button
                className='submit-button'
                onClick={handleSubmit}
                disabled={!isValidPartialPayment}
                >
                    Submit
                </button>
            </div>
        </div>
    </div>
  )
}

export default CustomerCashOnDeliveryPaymentMethod
