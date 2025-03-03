import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { useParams } from 'react-router-dom'
import '../../CSS/StaffCSS/StaffOrderSummary.css';
import toast from 'react-hot-toast'
import PropTypes from 'prop-types';
import { orderDate } from '../../utils/OrderUtils';
import StaffInvoiceModal from '../../components/StaffComponents/StaffInvoiceModal';
import invoiceIcon from '../../assets/placeorder/placeorder-invoice-icon.png';

function AdminOrderSummaryPage() {
    const {adminId, orderId} = useParams();
    const [orders, setOrders] = useState([]);
    const [isInvoiceModalOpen, setInvoiceModalOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);

    const fetchOrders = async() => {
        try {
            let response;
    
            if(orderId){
                response = await axios.get(`/adminOrderWalkin/getOrderWalkinAdmin/${orderId}`);
            } else{
                response = await axios.get(`/adminOrderWalkin/getOrderWalkinAdmin`);
            }
    
            setOrders(orderId ? [response.data.order] : response.data.orders);
        } catch (error) {
            console.error(error);
            toast.error('Failed to fetch walkin orders.');
        }
    };
    
    useEffect(() => {
        if(orderId){
            fetchOrders();
        }
    }, [orderId]);

    const handleInvoiceClick = (order) => {
        setSelectedOrder(order);
        setInvoiceModalOpen(true);
    };

    if(orders.length === 0){
        return <div className='no-orders-message'>No orders found.</div>;
    }

  return (
    <div className='order-summary-container'>
        <StaffInvoiceModal
            isOpen={isInvoiceModalOpen}
            onClose={() => setInvoiceModalOpen(false)}
            order={selectedOrder}
            subtotal={selectedOrder ? selectedOrder.items.reduce((acc, item) => acc + item.finalPrice * item.quantity, 0) : 0}
            shippingCost={selectedOrder ? selectedOrder.shippingCost : 0}
        />
        <h1>Order Summary</h1>
        {
            orders.map((order) => (
                <div key={order._id} className='order-summary'>
                    <div className='order-buttons'>
                        <h2>Order ID: {order.orderNumber}</h2>
                        <button className='invoice-button' onClick={() => handleInvoiceClick(order)}>
                            <img src={invoiceIcon} alt='' />
                            <span>Invoice</span>
                        </button>
                    </div>
                    <p>Total Amount: ₱{(order.totalAmount ?? 0).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
                    <p>Cash Received: ₱{(order.cashReceived ?? 0).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
                    <p>Change: ₱{(order.changeTotal ?? 0).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>


                    <div className='order-items'>
                        {
                            order.items.map((item) => (
                                <div key={item.productId._id} className='order-item'>
                                    <img src={`${item.imageUrl}`} alt={item.productName} />
                                    <div>
                                        <h3>{item.productName}</h3>
                                        <p>Price: ₱ {item.price}</p>
                                        <p>Quantity: {item.quantity}</p>
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                    <hr />
                </div>
            ))
        }
    </div>
  )
}

AdminOrderSummaryPage.propTypes = {
    adminId: PropTypes.string.isRequired,
}

export default AdminOrderSummaryPage
