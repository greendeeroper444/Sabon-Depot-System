import React, { useState } from 'react'
import '../../CSS/CustomerCSS/CustomerPlaceOrder.css';
import invoiceIcon from '../../assets/placeorder/placeorder-invoice-icon.png'
import { useParams } from 'react-router-dom';
import UseOrderDetailsHook from '../../hooks/CustomerHooks/UseOrderDetailsHook';
import { formatDate, formatFullDate, getEstimatedDeliveryDate, getStatusClass, orderDate } from '../../utils/OrderUtils';
import InvoiceModal from '../../components/CustomerComponents/InvoiceModal';


function CustomerPlaceOrderPage() {
    const {customerId, orderId} = useParams();
    const {order, loading, error} = UseOrderDetailsHook(customerId, orderId);
    const [isInvoiceModalOpen, setInvoiceModalOpen] = useState(false);

    if(loading){
        return <div>Loading...</div>;
    }

    if(error){
        return <div>{error}</div>;
    }

    if(!order){
        return <div>Order not found</div>;
    }

    //calculate subtotal
    const subtotal = order.items.reduce((acc, item) => {
        return acc + item.finalPrice * item.quantity;
    }, 0);

    const shippingCost = 50;
    const statuses = order.paymentMethod === 'Pick Up' 
    ? ['Pending', 'Ready', 'PickedUp'] 
    : ['Pending', 'Shipped', 'OutForDelivery', 'Delivered'];

    const statusDates = {
        Pending: order.createdAt,
        Ready: order.readyDate,
        PickedUp: order.pickedUpDate,
        Shipped: order.shippedDate,
        OutForDelivery: order.outForDeliveryDate,
        Delivered: order.deliveredDate,
    };
  return (
    <div className='customer-place-order-container'>
        <div className='customer-place-order-header'>
            <div className='breadcrumb'>Home &gt; Orders &gt; ID {order._id}</div>
            <div className='order-id'>
                <h2>Order ID: {order._id}</h2>
                <button className='invoice-button' onClick={() => setInvoiceModalOpen(true)}>
                    <img src={invoiceIcon} alt="" />
                    <span>Invoice</span>
                </button>
            </div>
            <div className='order-details'>
                {
                    order.paymentMethod === 'Pick Up' ? (
                        <p className='estimated-delivery'>
                            <span role='img' aria-label='calendar'>📅</span> 
                            Pick up on: {orderDate(order.pickupDate)} at {order.pickupTime}
                        </p>
                    ) : (
                        <p className='estimated-delivery'>
                            <span role='img' aria-label='truck'>🚚</span> 
                            Estimated delivery: {getEstimatedDeliveryDate(order.createdAt)}
                        </p>
                    )
                }
            </div>
        </div>

         {/* dynamic Progress Tracker */}
            <div className="customer-place-order-progress-tracker">
                {
                    statuses.map((status) => (
                        <div 
                            key={status} 
                            className={`status ${status.toLowerCase().replace(/\s+/g, '')} ${getStatusClass(`is${status}`, order) === `is${status}` ? 'active' : ''}`}
                        >
                            <div className={`status-circle ${getStatusClass(`is${status}`, order) === `is${status}` ? 'active' : ''}`}></div>
                            <p>{status}</p>
                            <span>{statusDates[status] ? formatFullDate(statusDates[status]) : 'N/A'}</span>
                        </div>
                    ))
                }
            </div>

        {
            order.items.map(item => (
                <div key={item.productId._id} className='customer-place-order-item'>
                    <div className='item-image'>
                        <img src={`${import.meta.env.VITE_BASE_URL}${item.productId.imageUrl}`} alt={item.productId.productName} />
                    </div>
                    <div className='item-details'>
                        <h3>{item.productId.productName}</h3>
                        <p>{item.productId.category} | 250ml</p>
                    </div>
                    <div className='item-price'>
                        <p>₱ {item.finalPrice}.00</p>
                        <p>{`Qty: ${item.quantity}`}</p>
                    </div>
                </div>
            ))
        }

        <div className='customer-place-order-payment'>
            <div>
                <h4>Payment</h4>
                <p>{order.paymentMethod}</p>
            </div>
            <div>
                <h4>Delivery</h4>
                <p>Address</p>
                <p>{order.billingDetails.fullName}</p>
                <p>{order.billingDetails.address}</p>
            </div>
        </div>

        <div className='customer-place-order-summary'>
            <h4>Order Summary</h4>
            <div className='summary-item'>
                <span>Subtotal</span>
                <span> {`₱${subtotal.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`}</span>
            </div>
            {/* <div className='summary-item' style={{ color: 'red' }}>
                <span>Shipping</span>
                <span> {`₱${shippingCost.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`}</span>
            </div> */}
            <div className='customer-place-order-total'>
                <span>Total</span>
                <span> {`₱${order.totalAmount.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`}</span>
            </div>
        </div>
        <InvoiceModal
        isOpen={isInvoiceModalOpen}
        onClose={() => setInvoiceModalOpen(false)}
        order={order}
        subtotal={subtotal}
        shippingCost={shippingCost}
        />
    </div>
  )
}

export default CustomerPlaceOrderPage