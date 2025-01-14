import React from 'react'
import '../../../CSS/CustomerCSS/CustomerCheckout/CustomerBillingDetails.css';


const CustomerBillingDetails = ({
  isEditing,
  setIsEditing,
  billingDetails,
  handleInputChange,
  focusBillingDisplay,
  onClose
}) => {
  if(!isEditing) return null;

  return (
    <div className='modal-billing-details'>
        <div className='modal-billing-details-content'>
            <button
            className='modal-billing-details-close'
            onClick={() => setIsEditing(false)}
            >
                &times;
            </button>
            <h2>Edit Billing Information</h2>
                <form
                className='modal-billing-details-form'
                onSubmit={(e) => {
                    e.preventDefault();
                    setIsEditing(false);
                    focusBillingDisplay();
                }}
                >
                <div className='modal-billing-details-form-control'>
                    <label>First Name</label>
                    <input
                    type='text'
                    name='firstName'
                    value={billingDetails.firstName}
                    onChange={handleInputChange}
                    />
                </div>
                <div className='modal-billing-details-form-control'>
                    <label>Last Name</label>
                    <input
                    type='text'
                    name='lastName'
                    value={billingDetails.lastName}
                    onChange={handleInputChange}
                    />
                </div>
                <div className='modal-billing-details-form-control'>
                    <label>Middle Name</label>
                    <input
                    type='text'
                    name='middleInitial'
                    value={billingDetails.middleInitial}
                    onChange={handleInputChange}
                    />
                </div>
                <div className='modal-billing-details-form-control'>
                    <label>Email Address</label>
                    <input
                    type='email'
                    name='emailAddress'
                    value={billingDetails.emailAddress}
                    onChange={handleInputChange}
                    />
                </div>
                <div className='modal-billing-details-form-control'>
                    <label>Province</label>
                    <input
                    type='text'
                    name='province'
                    value={billingDetails.province}
                    onChange={handleInputChange}
                    />
                </div>
                <div className='modal-billing-details-form-control'>
                    <label>City</label>
                    <input
                    type='text'
                    name='city'
                    value={billingDetails.city}
                    onChange={handleInputChange}
                    />
                </div>
                <div className='modal-billing-details-form-control'>
                    <label>Barangay</label>
                    <input
                    type='text'
                    name='barangay'
                    value={billingDetails.barangay}
                    onChange={handleInputChange}
                    />
                </div>
                <div className='modal-billing-details-form-control'>
                    <label>Purok/Street/Subdivision</label>
                    <input
                    type='text'
                    name='purokStreetSubdivision'
                    value={billingDetails.purokStreetSubdivision}
                    onChange={handleInputChange}
                    />
                </div>
                <div className='modal-billing-details-form-control'>
                    <label>Contact Number</label>
                    <input
                    type='text'
                    name='contactNumber'
                    value={billingDetails.contactNumber}
                    onChange={handleInputChange}
                    />
                </div>
                <div className='modal-billing-details-form-control'>
                    <label>Client Type</label>
                    <input
                    type='text'
                    name='clientType'
                    value={billingDetails.clientType}
                    onChange={handleInputChange}
                    disabled
                    />
                </div>
                <button className='modal-billing-details-save-button' onClick={onClose}>
                    Save
                </button>
            </form>
        </div>
    </div>
  )
}

export default CustomerBillingDetails
