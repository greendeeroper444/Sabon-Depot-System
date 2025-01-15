import React, { useContext } from 'react'
import { AdminContext } from '../../../../contexts/AdminContexts/AdminAuthContext';
import { StaffContext } from '../../../../contexts/StaffContexts/StaffAuthContext';

function OrdersPickupTable({ orders, handleRowClick, orderDate, noOrdersMessage }) {
    const {admin} = useContext(AdminContext);
    const {staff} = useContext(StaffContext);

    const handlePropagationClick = (e) => {
        e.stopPropagation();
    };

    //filter for Cash On Delivery orders
    const cashOnDeliveryOrders = orders.filter(order => order.paymentMethod === 'Pick Up');

  return (
    <table className='staff-orders-table'>
        <thead>
            <tr>
                <th>Orders</th>
                <th>Date</th>
                <th>Customer</th>
                <th>Payment</th>
                <th>Status</th>
                <th>Price</th>
                <th></th>
            </tr>
        </thead>
        <tbody>
            {
                cashOnDeliveryOrders.length === 0 ? (
                    <tr>
                        <td colSpan={7} style={{ textAlign: 'center', padding: '20px', color: 'grey' }}>
                            {noOrdersMessage || 'No Cash On Delivery orders available.'}
                        </td>
                    </tr>
                ) : (
                    cashOnDeliveryOrders.map((order) => (
                        <tr
                            key={order._id}
                            className='clickable-row'
                            onClick={() => handleRowClick(order._id)}
                        >
                            <td>
                                <div>
                                    <span style={{ fontSize: '12px', color: 'black' }}>#ID {order.orderNumber}</span>
                                </div>
                            </td>
                            <td>{orderDate(order.createdAt)}</td>
                            <td>
                                {order.billingDetails.firstName},
                                <br />
                                {order.billingDetails.middleInitial},
                                <br />
                                {order.billingDetails.lastName}
                            </td>
                            <td><span className={`badge ${order.paymentStatus.toLowerCase()}`}>{order.paymentStatus}</span></td>
                            <td><span className={`badge ${order.orderStatus.toLowerCase().replace(/\s+/g, '-')}`}>{order.orderStatus}</span></td>
                            <td>{`₱${order.totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}</td>
                        </tr>
                    ))
                )
            }
        </tbody>
    </table>
  )
}

export default OrdersPickupTable