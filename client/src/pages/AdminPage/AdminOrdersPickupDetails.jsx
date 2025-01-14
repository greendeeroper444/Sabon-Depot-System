import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import axios from 'axios';
import '../../CSS/StaffCSS/StaffOrdersDetails.css';
import editIcon from '../../assets/staff/stafficons/staff-orders-edit-icon.png'
import StaffPaymentMethodModal from '../../components/StaffComponents/StaffOrdersDetails/StaffPaymentMethodModal';
import { getStatusClass, orderDate } from '../../utils/OrderUtils';
import toast from 'react-hot-toast';

function AdminOrdersPickupDetailsPage() {
    const {orderId} = useParams(); 
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // //update order status function
    // const handleStatusUpdate = async(status) => {
    //     try {
    //         const response = await axios.put(`/staffOrders/updateOrderStatusStaff/${orderId}`, {status});
    //         setOrder(response.data);
    //     } catch (error) {
    //         setError(error.message);
    //     }
    // };

    // //approve order fucntion
    // const handleApprove = async() => {
    //     try {
    //         const response = await axios.put(`/staffOrders/approveOrderStaff/${orderId}`);
    //         setOrder(response.data);
    //         setIsModalOpen(false);

    //         toast.success('Your order has been confirmed.');
    //     } catch (error) {
    //         setError(error.message);
    //     }
    // };
    const handleStatusUpdate = async(status) => {
        if(status === 'isPickedUp'){
            setIsModalOpen(true);
            return; 
        }
        //other statuses
        await axios.put(`/staffOrders/updateOrderStatusStaff/${orderId}`, {status});
    };
    
    const handleApprove = async(cashReceived, changeTotal) => {
        try {
            const response = await axios.put(`/staffOrders/updateOrderStatusStaff/${orderId}`, {
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
        const fetchOrderDetails = async() => {
            try {
                const response = await axios.get(`/staffOrders/getOrderDetailsStaff/${orderId}`);
                setOrder(response.data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchOrderDetails();
    }, [orderId]);

    if(loading) return <div>Loading...</div>;
    if(error) return <div>Error: {error}</div>;

  return (
    <div className='staff-order-details-container'>
        <StaffPaymentMethodModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        handleApprove={handleApprove}
        order={order}
        />

        <div className='order-header'>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                <h1>Order # {order._id}</h1>
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
                >
                    Ready
                </button>
                <button
                className={`order-actions-button pickedup ${getStatusClass('isPickedUp', order) === 'isPickedUp' ? 'active' : ''}`}
                onClick={() => handleStatusUpdate('isPickedUp')}
                >
                    Picked Up
                </button>
            </div>
        </div>

        <div className='order-dates'>
            <p><strong>Placed on:</strong> {orderDate(order.createdAt)}</p>
            {/* <p><strong>Updated:</strong> {new Date(order.updatedAt).toLocaleDateString()}</p> */}
            <p><strong>Paid on:</strong> {orderDate(order.pickedUpDate ? new Date(order.pickedUpDate).toLocaleDateString() : 'N/A')}</p>
        </div>

        <div className='order-info'>
            <div className='order-section'>
                <h3 style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span>Customer & Order</span> 
                    {/* <img src={editIcon} alt='Edit Icon' className='edit-icon' /> */}
                </h3>
                <p>
                    <strong>Name:</strong>
                    {' '}{order.billingDetails.firstName} {' '}
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
                <p><strong>Delivery method:</strong> {order.paymentMethod}</p>
            </div>
            <div className='order-section'>
                <h3 style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span>Shipping Address</span> 
                    {/* <img src={editIcon} alt='Edit Icon' className='edit-icon' /> */}
                </h3>
                <p>{order.billingDetails.province}</p>
                <p>{order.billingDetails.city}</p>
                <p>{order.billingDetails.barangay}</p>
                <p>{order.billingDetails.purokStreetSubdivision}</p>
            </div>
            <div className='order-section'>
                <h3 style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span>Billing Address</span> 
                    {/* <img src={editIcon} alt='Edit Icon' className='edit-icon' /> */}
                </h3>
                <p>{order.billingDetails.city}</p>
            </div>
        </div>

        <div className='order-items'>
            <h3>Items Ordered</h3>
            <table>
                <thead>
                    <tr>
                        <th>Items Name</th>
                        <th>SKU</th>
                        <th>Location</th>
                        <th>Quantity</th>
                        <th>Price</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        order.items.map(item => (
                            <tr key={item._id}>
                                <td style={{ display: 'flex', alignItems: 'center' }}><img src={`${import.meta.env.VITE_BASE_URL}${item.imageUrl}`} alt='' />{item.productName}</td>
                                <td>{item.sku}</td>
                                <td>{item.location}</td>
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
