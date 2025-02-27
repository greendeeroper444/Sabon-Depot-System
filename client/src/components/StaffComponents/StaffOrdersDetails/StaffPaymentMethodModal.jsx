import React, { useState } from 'react'
import '../../../CSS/StaffCSS/StaffOrdersDetails/StaffPaymentMethodModal.css';

function StaffPaymentMethodModal({isOpen, onClose, handleApprove, order}) {
    const [cashReceived, setCashReceived] = useState('');
    const [error, setError] = useState('');

    if(!isOpen) return null;

    const changeTotal = cashReceived - order.totalAmount;

    const handleInputChange = (value) => {
        const receivedValue = Number(value);
        setCashReceived(receivedValue);

        //automatic validation
        if(value === ''){
            setError('');
        } else if(receivedValue < order.totalAmount){
            setError('The cash received is not enough to pay the total amount.');
        } else{
            setError('');
        }
    };

  return (
    <div className='staff-payment-container-overlay'>
        <div className='staff-payment-container-content'>
            <h2>Complete Payment</h2>
            <h2>{`₱${ order.totalAmount || '' }`}</h2>
            <label>
                Given Total:
                <input
                type="number"
                value={cashReceived || ''}
                onChange={(e) => handleInputChange(e.target.value)}
                />
            </label>
                {cashReceived !== '' && error && <p className="error-message">{error}</p>}
            <p>
            Change:{' '}
            <strong>
                {changeTotal > 0 ? changeTotal : changeTotal < 0 ? '' : 0}
            </strong>
            </p>
            <button
            onClick={() => handleApprove(cashReceived, changeTotal)}
            disabled={!!error || cashReceived === ''} //disable button if error or no input
            >
                Confirm
            </button>
            <button onClick={onClose}>Cancel</button>
        </div>
    </div>
  )
}

export default StaffPaymentMethodModal
