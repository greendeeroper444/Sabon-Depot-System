import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import axios from 'axios';
import '../../CSS/StaffCSS/StaffOrdersDetails.css';
import editIcon from '../../assets/staff/stafficons/staff-orders-edit-icon.png'
import StaffPaymentMethodModal from '../../components/StaffComponents/StaffOrdersDetails/StaffPaymentMethodModal';
import { getStatusClass, orderDate, orderDate2 } from '../../utils/OrderUtils';
import toast from 'react-hot-toast';
import InvoiceModal from '../../components/CustomerComponents/InvoiceModal';

function AdminOrdersPickupDetailsPage() {
    const {orderId} = useParams(); 
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isInvoiceModalOpen, setInvoiceModalOpen] = useState(false);
    const [activeInput, setActiveInput] = React.useState(null);
    const [inputFields, setInputFields] = useState({});

    const handleUpdateOrderReceipt = async(itemId) => {
        try {
            const receipt = inputFields[itemId]?.receipt;
            if(!receipt){
                toast.error('Please provide a receipt.');
                return;
            }
    
            const response = await axios.put(
                `/adminOrders/updateOrderReceiptAdmin/${orderId}`,
                {receipt}
            );
    
            toast.success(response.data.message);
            fetchOrderDetails();
        } catch (error) {
            console.error(error);
            toast.error('Error updating receipt.');
        }
    };
    
    const handleInputChange = (itemId, field, value) => {
        setInputFields((prev) => ({
            ...prev,
            [orderId]: {
                ...prev[orderId],
                [field]: value,
            },
        }));
    };
    
    const resetInputField = (itemId) => {
        setInputFields((prev) => ({
            ...prev,
            [orderId]: {
                ...prev[orderId],
                receipt: '',
            },
        }));
    };
    
    const fetchOrderDetails = async() => {
        try {
            const response = await axios.get(`/adminOrders/getOrderDetailsAdmin/${orderId}`);
            setOrder(response.data);
    
            //initialize inputFields with existing receipt values for each item
            const initialInputFields = response.data.items.reduce((acc, item) => {
                acc[orderId] = {receipt: item.receipt || ''};
                return acc;
            }, {});
    
            setInputFields(initialInputFields);
        } catch (error) {
            setError(error.message);
        } finally{
            setLoading(false);
        }
    };
    
    
    useEffect(() => {
        if(orderId){
            fetchOrderDetails();
        }
    }, [orderId]); 
    

    

    const handleStatusUpdate = async(status) => {
        if(status === 'isPickedUp'){
            setIsModalOpen(true);
            return; 
        }
        //other statuses
        // await axios.put(`/adminOrders/updateOrderStatusStaff/${orderId}`, {status});
        try {
            const response = await axios.put(`/adminOrders/updateOrderStatusAdmin/${orderId}`, {status});
            setOrder(response.data);
            toast.success(`Order status updated to ${status === 'isReady' ? 'Ready to Pick Up' : 'Picked Up'}`);
        } catch (error) {
            console.error(error);
            toast.error('Failed to update order status.');
        }
    };
    
    const handleApprove = async(cashReceived, changeTotal) => {
        try {
            const response = await axios.put(`/adminOrders/updateOrderStatusAdmin/${orderId}`, {
                status: 'isPickedUp',
                cashReceived,
                changeTotal,
            });
            setOrder(response.data);
            setIsModalOpen(false);
            toast.success('Order marked as picked up!');
        } catch (error) {
            console.error(error);
            toast.error('Failed, you need to input please.');
        }
    };

    useEffect(() => {
        fetchOrderDetails();
    }, [order?.orderStatus]);

    useEffect(() => {
        fetchOrderDetails();
    }, [orderId]);

    const subtotal = order?.items?.reduce((acc, item) => acc + item.finalPrice * item.quantity, 0);
    const shippingCost = 50;

    if(loading) return <div>Loading...</div>;
    if(error) return <div>Error: {error}</div>;

  return (
    <div className='staff-order-details-container'>
        <button className='invoice-button' onClick={() => setInvoiceModalOpen(true)}>
            <span>Invoice</span>
        </button>
        
        <StaffPaymentMethodModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        handleApprove={handleApprove}
        order={order}
        />
        <InvoiceModal
        isOpen={isInvoiceModalOpen}
        onClose={() => setInvoiceModalOpen(false)}
        order={order}
        subtotal={subtotal}
        shippingCost={shippingCost}
        />
 
        <div className='order-header'>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                <h1>
                    <span>Order # {order.orderNumber}</span>
                    <br />
                    <small>Date to Pick up: {orderDate2(order.pickupDate)} at {order.pickupTime}</small>
                </h1>
                <div className='order-status'>
                    {
                        order.isPickedUp ? (
                            <span>Order Completed</span>
                        ) : (
                            <span>Order Not Completed</span>
                        )
                    }
                </div>
            </div>
            <div className='order-actions'>
                <button
                className={`order-actions-button ready ${getStatusClass('isReady', order) === 'isReady' ? 'active' : ''}`}
                onClick={() => handleStatusUpdate('isReady')}
                disabled={order.orderStatus === 'Picked Up'}
                >
                Ready To Pick Up
                </button>

                <button
                className={`order-actions-button pickedup ${getStatusClass('isPickedUp', order) === 'isPickedUp' ? 'active' : ''}`}
                onClick={() => handleStatusUpdate('isPickedUp')}
                disabled={order.orderStatus === 'Picked Up' || order.orderStatus === 'Pending'}
                >
                Picked Up
                </button>
            </div>
        </div>

        <div className='order-info'>
            <div className='order-section'>
                <h3 style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span>Customer & Order</span> 
                    {/* <img src={editIcon} alt='Edit Icon' className='edit-icon' /> */}
                </h3>
                <p>
                    <strong>Name:</strong>
                    {' '}{order.billingDetails?.firstName} {' '}
                    {order.billingDetails.middleInitial} {' '}
                    {order.billingDetails.lastName} 
                </p>
                <p><strong>Email:</strong> {order.billingDetails.emailAddress}</p>
                <p><strong>Phone:</strong> {order.billingDetails.contactNumber}</p>
                <p>
                    <strong>Total Amount:</strong> ₱
                    {order.totalAmount.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                </p>
                <p>
                    <strong>Cash Received:</strong> ₱
                    {order.cashReceived.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                </p>
                <p>
                    <strong>Change:</strong> ₱
                    {order.changeTotal.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                </p>
                <p><strong>Approved by:</strong> {order.whoApproved}</p>
            </div>
            <div className='order-section'>
                <h3 style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span>Status</span> 
                    {/* <img src={editIcon} alt='Edit Icon' className='edit-icon' /> */}
                </h3>
                <p style={{ fontSize: '16px' }}><strong>Order Status:</strong> {order.orderStatus === 'Ready' ? 'Ready To Pick Up' : order.orderStatus}</p>
                {/* {
                    !order.pickedUpDate && (
                        <p><strong>Status:</strong> Not paid yet</p>
                    )
                } */}
                <p><strong>Payment Status:</strong> {order.paymentStatus}</p>
            </div>
            <div className='order-section'>
                <h3 style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span>Date Tracker</span> 
                    {/* <img src={editIcon} alt='Edit Icon' className='edit-icon' /> */}
                </h3>
                <p><strong>Placed on:</strong> {orderDate(order.createdAt)}</p>
                {/* <p><strong>Updated:</strong> {new Date(order.updatedAt).toLocaleDateString()}</p> */}
                {
                    order.readyDate && (
                        <p><strong>Ready on:</strong> {orderDate(new Date(order.readyDate).toLocaleDateString())}</p>
                    )
                }
                {
                    order.pickedUpDate && (
                        <p><strong>Paid on:</strong> {orderDate(new Date(order.pickedUpDate).toLocaleDateString())}</p>
                    )
                }
            </div>
        </div>

        <div className='order-items'>
            <div className='items-ordered'>
                <h3>Items Ordered</h3>
                {
                    order && (
                        <div className='input-with-icons' key={orderId}>
                            <input
                                type="text"
                                className='input-line'
                                value={inputFields[orderId]?.receipt || ''}
                                onChange={(e) =>
                                    handleInputChange(orderId, 'receipt', e.target.value)
                                }
                                onFocus={() => setActiveInput({ id: orderId, field: 'receipt' })}
                                onBlur={() =>
                                inputFields[orderId]?.receipt?.trim()
                                ? null
                                : setActiveInput(null)
                                }
                                placeholder='Enter receipt'
                            />
                            {
                                inputFields[orderId]?.receipt && (
                                    <>
                                        <span
                                            className='icon check-icon'
                                            onClick={() => handleUpdateOrderReceipt(orderId)}
                                        >
                                            ✔️
                                        </span>
                                        <span
                                            className='icon times-icon'
                                            onClick={() => resetInputField(orderId)}
                                        >
                                            ❌
                                        </span>
                                    </>
                                )
                            }
                        </div>
                    )
                }

            </div>
            <p><strong>Receipt:</strong> {order.receipt}</p>
            <table>
                <thead>
                    <tr>
                        <th>Items Name</th>
                        {/* <th>SKU</th>
                        <th>Location</th> */}
                        <th>Quantity</th>
                        <th>Price</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        order.items.map(item => (
                            <tr key={orderId}>
                                <td style={{ display: 'flex', alignItems: 'center' }}><img src={`${item.imageUrl}`} alt='' />{item.productName}</td>
                                {/* <td>{item.sku}</td>
                                <td>{item.location}</td> */}
                                <td>{item.quantity ?? 'N/A'}</td>
                                <td>₱{item.price?.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2}) ?? 'N/A'}</td>
                                <td>₱{(item.price * item.quantity).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>
        </div>
    </div>
  )
}

export default AdminOrdersPickupDetailsPage
