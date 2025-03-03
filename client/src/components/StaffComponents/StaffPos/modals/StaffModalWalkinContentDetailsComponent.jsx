import React, { useEffect, useState } from 'react'
import '../../../../CSS/CustomerCSS/CustomerModalShopDetails.css';
import cancelIcon from '../../../../assets/modals/modal-icon-cancel.png';
import cancelIcon2 from '../../../../assets/modals/modal-icon-cancel-2.png';
import { useNavigate } from 'react-router-dom';
import Draggable from 'react-draggable';
import toast from 'react-hot-toast';
import axios from 'axios';
import PropTypes from 'prop-types';
import { calculateFinalPriceModalAdmin, calculateSubtotalModalAdmin } from '../../../../utils/AdminCalculateFinalPriceUtils';

function StaffModalWalkinContentDetailsComponent({isOpen, onClose, cartItems, setCartItems, staffId}) {
    const navigate = useNavigate();
    const [cashReceived, setCashReceived] = useState('');
    const [changeTotal, setChangeTotal] = useState(0);


    //handle quantity change
    const handleQuantityChange = async(cartItemId, newQuantity) => {
        if(newQuantity < 1) return;

        try {
            const response = await axios.put('/staffCart/updateProductQuantityStaff', {
                cartItemId,
                quantity: newQuantity,
            });

            if(response.data.success){
                const updatedCartItems = cartItems.map(item =>
                    item._id === cartItemId ? {...item, quantity: newQuantity} : item
                );
                setCartItems(updatedCartItems);
            } else {
                toast.error(response.data.message || 'Failed to update quantity.');
            }
        } catch (error) {
            console.error('Error updating quantity:', error);
            toast.error('Failed to update quantity. Please try again.');
        }
    };

    //handle checkout
    const handleCheckout = async() => {
        if(cartItems.length === 0){
            toast.error('Cart is empty!');
            return;
        }

        try {
            const {finalSubtotal} = calculateSubtotalModalAdmin(cartItems);

            const orderData = {
                items: cartItems.map((item) => ({
                    productId: item.productId._id,
                    productName: item.productId.productName,
                    quantity: item.quantity,
                    finalPrice: calculateFinalPriceModalAdmin(item),
                })),
                // totalAmount: calculateSubtotalModalAdmin(cartItems),
                totalAmount: parseFloat(finalSubtotal.replace(/,/g, '')),
                cashReceived,
                changeTotal,
            };

            const response = await axios.post('/staffOrderWalkin/addOrderWalkinStaff', orderData);

            if(response.data.success){
                const orderId = response.data.orderId;
                toast.success(`Order created successfully! Order ID: ${orderId}`);
                setCartItems([]);
                onClose();
                navigate(`/staff/order-summary/${orderId}`);
            } else {
                toast.error(response.data.message || 'Failed to create the order.');
            }
        } catch (error) {
            console.error('Order creation error:', error);
            toast.error('Failed to create the order. Please try again.');
        }
    };


    //delete function
    const handleCartItemDelete = async(cartItemId) => {
        try {
            const response = await axios.delete(`/staffCart/removeProductFromCartStaff/${cartItemId}`);
            if(response.data.success){
                // toast.success(response.data.message);
                fetchCartItems();
            } else{
                throw new Error('Failed to delete product from cart');
            }
        } catch (error) {
            console.error(error);
        }
    };

    const fetchCartItems = async() => {
        try {
            const response = await axios.get(`/staffCart/getProductCartStaff/${staffId}`);
            setCartItems(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            console.error(error);
            setCartItems([]);
        }
    };
    

    useEffect(() => {
        if(isOpen && staffId){
            fetchCartItems();
            console.log("Fetched cartItems:", cartItems);
        }
    }, [isOpen, staffId]);

    // 
    const handleCashReceivedChange = (value) => {
        const receivedValue = parseFloat(value) || '';
    
        setCashReceived(receivedValue);
    
        //get the final subtotal as a number by removing '₱' and commas
        const {finalSubtotal} = calculateSubtotalModalAdmin(cartItems);
        const numericSubtotal = parseFloat(finalSubtotal.replace(/₱|,/g, '')) || 0;
    
        const change = receivedValue - numericSubtotal;
        setChangeTotal(change);
    };

    if(!isOpen) return null;

  return (
    <div className='customer-modal-overlay'>
        <Draggable>
            <div className='customer-modal-container'>
                <div className='customer-modal-header'>
                    <div className='shopping-cart-content'>
                        <h2>Shopping Cart Walkin</h2>
                        <div className='customer-modal-header-line'></div>
                    </div>
                    <span className='customer-modal-close' onClick={onClose}>
                        <img src={cancelIcon} alt='Close Icon' />
                    </span>
                </div>

                <div className='customer-modal-content'>
                    {
                        Array.isArray(cartItems) && cartItems.length === 0 ? (
                            <div className='no-items-message'>No items in this cart</div>
                        ) : (
                            Array.isArray(cartItems) &&
                            cartItems.map((cartItem) =>
                                cartItem.productId ? (
                                    <div key={cartItem._id} className='customer-modal-content-group'>
                                        <img
                                            src={`${cartItem.productId.imageUrl}`}
                                            alt=''
                                            className='customer-modal-product-items'
                                        />
                                        <div className='customer-modal-product-items-content'>
                                            <span>{cartItem.productId.productName}</span>

                                            {/* dropdown for size options */}
                                            {/* <select
                                            className='size-select'
                                            value={sizeSelection[cartItem._id] || ''}
                                            onChange={(e) => handleSizeChange(cartItem._id, e.target.value)}
                                            >
                                                <option value='' disabled>
                                                    {cartItem.productId.sizeUnit}
                                                </option>
                                                <option value={cartItem.productId.productSize}>
                                                    {cartItem.productId.productSize}
                                                </option>
                                            </select> */}
                                            <p style={{ fontSize: '12px' }}>{cartItem.productId.productSize}</p>

                                            <p>
                                                <input
                                                    type='number'
                                                    value={cartItem.quantity}
                                                    min='1'
                                                    onChange={(e) => handleQuantityChange(cartItem._id, parseInt(e.target.value))}
                                                    className='input-quantity-update'
                                                />
                                                <span>X</span>
                                                <span>{`₱ ${calculateFinalPriceModalAdmin(cartItem)}`}</span>
                                            </p>
                                        </div>
                                        <span
                                        className='customer-modal-cancel-items'
                                        onClick={() => handleCartItemDelete(cartItem._id)}
                                        >
                                            <img src={cancelIcon2} alt='Cancel Icon' />
                                        </span>
                                    </div>
                                ) : null
                            )
                        )
                    }
                </div>

                <div className='customer-modal-footer'>
                    <div className='products-subtotal'>
                        <span>Subtotal:</span>
                        <span>₱ {calculateSubtotalModalAdmin(cartItems).rawSubtotal}</span>
                    </div>
                    {
                        calculateSubtotalModalAdmin(cartItems).discountRate > 0 && (
                            <div className='products-subtotal'>
                                <span>Discount ({calculateSubtotalModalAdmin(cartItems).discountRate}%):</span>
                                <span>- ₱ {calculateSubtotalModalAdmin(cartItems).discountAmount}</span>
                            </div>
                        )
                    }
                    <div className='products-subtotal'>
                        <span>Total:</span>
                        <span> ₱ {calculateSubtotalModalAdmin(cartItems).finalSubtotal}</span>
                    </div>
                    <div className='products-subtotal'>
                        <span>Cash:</span>
                        <input
                            type='number'
                            min='1'
                            value={cashReceived}
                            onChange={(e) => handleCashReceivedChange(e.target.value)}
                        />
                    </div>
                    <div className='products-subtotal'>
                        <span>Change:</span>
                        <span> ₱ {changeTotal.toFixed(2)}</span>
                    </div>
                </div>



                <footer>
                    <div>
                        <button onClick={handleCheckout}>Checkout</button>
                    </div>
                </footer>
            </div>
        </Draggable>
    </div>
  )
}

StaffModalWalkinContentDetailsComponent.propTypes = {
    cartItems: [],
}

export default StaffModalWalkinContentDetailsComponent
