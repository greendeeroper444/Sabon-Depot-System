import React, { useEffect, useState } from 'react'
import '../../../../CSS/CustomerCSS/CustomerModalShopDetails.css';
import cancelIcon from '../../../../assets/modals/modal-icon-cancel.png';
import cancelIcon2 from '../../../../assets/modals/modal-icon-cancel-2.png';
import { useNavigate } from 'react-router-dom';
import Draggable from 'react-draggable';
import toast from 'react-hot-toast';
import axios from 'axios';
import PropTypes from 'prop-types';
import { calculateFinalRefillPriceModalStaff, calculateSubtotalModalStaff } from '../../../../utils/StaffCalculateVolume';

function AdminModalRefillingContentDetailsComponent({isOpen, onClose, cartItems, setCartItems, adminId}) {
    const navigate = useNavigate();
    const [cashReceived, setCashReceived] = useState('');
    const [changeTotal, setChangeTotal] = useState(0);
    const [sizeUnits, setSizeUnits] = useState('Liter');

    const handleVolumeChange = (cartItemId, newVolume) => {
        if(newVolume === '' || newVolume < 1){
            //allow empty string for backspacing
            const updatedCartItems = cartItems.map(item =>
                item._id === cartItemId ? {...item, volume: newVolume} : item
            );
            setCartItems(updatedCartItems);
            return;
        }
    
        try {
            axios.put('/adminCartRefill/updateProductVolumeRefillAdmin', {
                cartItemId,
                volume: parseFloat(newVolume) || 1, //convert when sending to backend
                sizeUnit: sizeUnits[cartItemId] || 'Liter'
            }).then(response => {
                if(response.data.success){
                    const updatedCartItems = cartItems.map(item =>
                        item._id === cartItemId
                            ? {...item, volume: parseFloat(newVolume) || 1}
                            : item
                    );
                    setCartItems(updatedCartItems);
                } else {
                    toast.error(response.data.message || 'Failed to update volume.');
                }
            });
        } catch (error) {
            console.error('Error updating volume:', error);
            toast.error('Failed to update volume. Please try again.');
        }
    };
    
    const handlePriceChange = (cartItemId, newPrice) => {
        if(newPrice === '' || newPrice < 1){
            const updatedCartItems = cartItems.map(item =>
                item._id === cartItemId ? {...item, price: newPrice} : item
            );
            setCartItems(updatedCartItems);
            return;
        }
    
        try {
            axios.put('/adminCartRefill/updateProductPriceRefillAdmin', {
                cartItemId,
                price: parseFloat(newPrice) || 0
            }).then(response => {
                if(response.data.success){
                    const updatedCartItems = cartItems.map(item =>
                        item._id === cartItemId
                            ? {...item, price: parseFloat(newPrice) || 0}
                            : item
                    );
                    setCartItems(updatedCartItems);
                } else {
                    toast.error(response.data.message || 'Failed to update price.');
                }
            });
        } catch (error) {
            console.error('Error updating price:', error);
            toast.error('Failed to update price. Please try again.');
        }
    };
    

    const handleSizeUnitChange = async(cartItemId, newUnit) => {
        setSizeUnits(prev => ({...prev, [cartItemId]: newUnit}));
    
        try {
            const response = await axios.put('/adminCartRefill/updateProductVolumeRefillAdmin', {
                cartItemId,
                volume: cartItems.find(item => item._id === cartItemId)?.volume || 1,
                sizeUnit: newUnit
            });
    
            if(response.data.success){
                const updatedCartItems = cartItems.map(item =>
                    item._id === cartItemId
                    ? {...item, sizeUnit: newUnit}
                    : item
                );
                setCartItems(updatedCartItems);
            } else {
                toast.error(response.data.message || 'Failed to update size unit.');
            }
        } catch (error) {
            console.error('Error updating size unit:', error);
            toast.error('Failed to update size unit. Please try again.');
        }
    };
    

    //handle checkout
    const handleCheckout = async() => {
        if(cartItems.length === 0){
            toast.error('Cart is empty!');
            return;
        }

        try {
            const {finalSubtotal} = calculateSubtotalModalStaff(cartItems);
            const parsedTotalAmount = parseFloat(finalSubtotal.replace(/,/g, ''));

            if(isNaN(parsedTotalAmount) || parsedTotalAmount <= 0){
                toast.error('Invalid total amount!');
                return;
            }

            const orderData = {
                items: cartItems.map((item) => ({
                    productId: item.productId._id,
                    productName: item.productId.productName,
                    volume: item.volume,
                    price: item.price,
                    productSize: item.productSize,
                    sizeUnit: item.sizeUnit,
                })),
                totalAmount: parsedTotalAmount,
                cashReceived: Number(cashReceived) || 0,
                changeTotal: Number(changeTotal) || 0,
            };

            const response = await axios.post('/adminOrderRefill/addOrderRefillAdmin', orderData);

            if(response?.data?.success){
                const orderId = response.data.orderId;
                toast.success(`Order created successfully! Order ID: ${orderId}`);
                setCartItems([]);
                onClose();
                navigate(`/admin/order-summary-refill/${orderId}`);
            } else {
                toast.error(response?.data?.message || 'Failed to create the order.');
            }
        } catch (error) {
            console.error('Order creation error:', error);
            toast.error('Failed to create the order. Please try again.');
        }
    };

    //delete function
    const handleCartItemDelete = async(cartItemId) => {
        try {
            const response = await axios.delete(`/adminCartRefill/removeProductFromCartRefillAdmin/${cartItemId}`);
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
            const response = await axios.get(`/adminCartRefill/getProductCartRefillAdmin/${adminId}`);
            // setCartItems(response.data);
            setCartItems(response.data.map(item => ({
                ...item,
                price: item.price || 0
            })));
        } catch (error) {
            console.error(error);
        }
    };

    const handleCashReceivedChange = (value) => {
        const receivedValue = parseFloat(value) || '';
    
        setCashReceived(receivedValue);
    
        //get the final subtotal as a number by removing '₱' and commas
        const {finalSubtotal} = calculateSubtotalModalStaff(cartItems);
        const numericSubtotal = parseFloat(finalSubtotal.replace(/₱|,/g, '')) || 0;
    
        const change = receivedValue - numericSubtotal;
        setChangeTotal(change);
    };

    useEffect(() => {
        if(isOpen && adminId){
            fetchCartItems();
        }
    }, [isOpen, adminId]);

    if(!isOpen) return null;

  return (
    <div className='customer-modal-overlay'>
        <Draggable>
            <div className='customer-modal-container'>
                <div className='customer-modal-header'>
                    <div className='shopping-cart-content'>
                        <h2>Shopping Cart Refill</h2>
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
                                        <div className='cylinder'>
                                            <div
                                            className='water'
                                            style={{
                                            height: `${(cartItem.productId.volume/ cartItem.productId.maximumSizeLiter) * 100}%`,
                                            background: cartItem.productId.color
                                            }}
                                            ></div>
                                        </div>

                                        <div className='customer-modal-product-items-content'>
                                            <span>{cartItem.productId.productName}</span>
                                            {/* <p style={{ fontSize: '12px' }}>{cartItem.productId.productSize} Liter</p> */}
                                            <p  style={{ fontSize: '12px' }}>{cartItem.productId.volume} Liter</p>
                                            <p>
                                            <input
                                            type='text'
                                            value={cartItem.volume}
                                            onChange={(e) => handleVolumeChange(cartItem._id, e.target.value)}
                                            className='input-quantity-update'
                                            />

                                                {/* select size unit */}
                                                <select
                                                    value={sizeUnits[cartItem._id] || 'Liter'}
                                                    onChange={(e) => handleSizeUnitChange(cartItem._id, e.target.value)}
                                                >
                                                    <option value="Liter">Liter</option>
                                                    <option value="Mililiter">Mililiter</option>
                                                    <option value="Gallon">Gallon</option>
                                                </select>
                                                <span>X</span>
                                                <input
                                                type='text'
                                                value={cartItem.price || ''} 
                                                onChange={(e) => handlePriceChange(cartItem._id, e.target.value)}
                                                className='input-price-display'
                                                />

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
                        <span>₱ {calculateSubtotalModalStaff(cartItems).rawSubtotal}</span>
                    </div>
                    {
                        calculateSubtotalModalStaff(cartItems).discountRate > 0 && (
                            <div className='products-subtotal'>
                                <span>Discount ({calculateSubtotalModalStaff(cartItems).discountRate}%):</span>
                                <span>- ₱ {calculateSubtotalModalStaff(cartItems).discountAmount}</span>
                            </div>
                        )
                    }
                    <div className='products-subtotal'>
                        <span>Total:</span>
                        <span> ₱ {calculateSubtotalModalStaff(cartItems).finalSubtotal}</span>
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

AdminModalRefillingContentDetailsComponent.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    cartItems: PropTypes.arrayOf(
        PropTypes.shape({
            _id: PropTypes.string.isRequired,
            productId: PropTypes.shape({
                finalPrice: PropTypes.number,
                price: PropTypes.number.isRequired,
                imageUrl: PropTypes.string.isRequired,
                productName: PropTypes.string.isRequired,
                sizeUnit: PropTypes.string.isRequired,
                productSize2: PropTypes.string.isRequired,
                volume: PropTypes.number.isRequired,
            }).isRequired,
            volume: PropTypes.number.isRequired,
            finalPrice: PropTypes.number,
        })
    ).isRequired,
    setCartItems: PropTypes.func.isRequired,
    adminId: PropTypes.string.isRequired,
}

export default AdminModalRefillingContentDetailsComponent
