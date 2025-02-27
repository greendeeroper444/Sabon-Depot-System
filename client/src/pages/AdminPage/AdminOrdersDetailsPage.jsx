import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import axios from 'axios';
import '../../CSS/StaffCSS/StaffOrdersDetails.css';
import editIcon from '../../assets/staff/stafficons/staff-orders-edit-icon.png'
import StaffPaymentMethodModal from '../../components/StaffComponents/StaffOrdersDetails/StaffPaymentMethodModal';
import { getStatusClass, orderDate } from '../../utils/OrderUtils';
import toast from 'react-hot-toast';
import InvoiceModal from '../../components/CustomerComponents/InvoiceModal';

function AdminOrdersDetailsPage() {
    const {orderId} = useParams(); 
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isInvoiceModalOpen, setInvoiceModalOpen] = useState(false);

    //update order status function
    const handleStatusUpdate = async(status) => {
        try {
            const response = await axios.put(`/adminOrders/updateOrderStatusAdmin/${orderId}`, {status});
            setOrder(response.data);
        } catch (error) {
            setError(error.message);
        }
    };

    //approve order fucntion
    const handleApprove = async() => {
        try {
            const response = await axios.put(`/adminOrders/approveOrderAdmin/${orderId}`);
            setOrder(response.data);
            setIsModalOpen(false);

            toast.success('Your order has been confirmed.');
        } catch (error) {
            setError(error.message);
        }
    };

    const fetchOrderDetails = async() => {
        try {
            const response = await axios.get(`/adminOrders/getOrderDetailsAdmin/${orderId}`);
            setOrder(response.data);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
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
                <h1>Order # {order.orderNumber}</h1>
                <div className='order-status'>
                    {
                        order.isDelivered ? (
                            <span>Order Completed</span>
                        ) : (
                            <span>Order Not Completed</span>
                        )
                    }
                </div>
            </div>
            <div className='order-actions'>
                <button
                className={`order-actions-button shipped ${getStatusClass('isShipped', order) === 'isShipped' ? 'active' : ''}`}
                onClick={() => handleStatusUpdate('isShipped')}
                disabled={order.orderStatus === 'Out For Delivery' || order.orderStatus === 'Delivered'}
                >
                    Shipped
                </button>
                <button
                className={`order-actions-button outForDelivery ${getStatusClass('isOutForDelivery', order) === 'isOutForDelivery' ? 'active' : ''}`}
                onClick={() => handleStatusUpdate('isOutForDelivery')}
                disabled={order.orderStatus === 'Delivered' || order.orderStatus === 'Pending'}
                >
                    Out For Delivery
                </button>
                <button
                className={`order-actions-button delivered ${getStatusClass('isDelivered', order) === 'isDelivered' ? 'active' : ''}`}
                onClick={() => handleStatusUpdate('isDelivered')}
                disabled={order.orderStatus === 'Pending' || order.orderStatus === 'Shipped'}
                >
                    Delivered
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
                    {' '}{order.billingDetails.firstName} {' '}
                    {order.billingDetails.middleInitial} {' '}
                    {order.billingDetails.lastName} 
                </p>
                <p><strong>Email:</strong> {order.billingDetails.emailAddress}</p>
                <p><strong>Phone:</strong> {order.billingDetails.contactNumber}</p>
                <p style={{ fontSize: '16px' }}><strong>Status:</strong> {order.orderStatus}</p>
                {/* <p><strong>Payment terms:</strong> {order.paymentTerms}</p> */}
                <p><strong>Delivery method:</strong> {order.paymentMethod}</p>
            </div>
            <div className='order-section'>
                <h3 style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span>Shipping Address</span> 
                    {/* <img src={editIcon} alt='Edit Icon' className='edit-icon' /> */}
                </h3>
                <p>
                    {order.billingDetails.province},{' '} 
                    {order.billingDetails.city}, {' '}
                    {order.billingDetails.barangay}, { ''}
                    {order.billingDetails.purokStreetSubdivision}
                </p>
            </div>
            <div className='order-section'>
                <h3 style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span>Date Tracker</span> 
                    {/* <img src={editIcon} alt='Edit Icon' className='edit-icon' /> */}
                </h3>
                <p><strong>Placed on:</strong> {orderDate(order.createdAt)}</p>
                {/* <p><strong>Updated:</strong> {new Date(order.updatedAt).toLocaleDateString()}</p> */}
                {
                    order.shippedDate && (
                        <p><strong>Shipped on:</strong> {orderDate(new Date(order.shippedDate).toLocaleDateString())}</p>
                    )
                }
                 {
                    order.outForDeliveryDate && (
                        <p><strong>Out For Delivery on:</strong> {orderDate(new Date(order.outForDeliveryDate).toLocaleDateString())}</p>
                    )
                }
                {
                    order.deliveredDate && (
                        <p><strong>Paid on:</strong> {orderDate(new Date(order.deliveredDate).toLocaleDateString())}</p>
                    )
                }
            </div>
        </div>

        <div className='order-items'>
            <h3>Items Ordered</h3>
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
                            <tr key={item._id}>
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

export default AdminOrdersDetailsPage
