import React, { useEffect, useState } from 'react'
import '../../../CSS/StaffCSS/StaffSettings/StaffNotificationsComponent.css'
import { Link } from 'react-router-dom';
import axios from 'axios';

function AdminNotificationsComponent() {
    const [orderNotifications, setOrderNotifications] = useState([]);
    const [expirationNotifications, setExpirationNotifications] = useState([]);
    const [lowStockNotifications, setLowStockNotifications] = useState([]);

    //fetch order-related notifications
    const fetchOrderNotifications = async() => {
        try {
            const response = await axios.get('/adminNotifications/getNotificationsOrderAdmin');
            setOrderNotifications(response.data);
        } catch (error) {
            console.error('Error fetching order notifications:', error);
        }
    };

    //fetch general admin (expiration) notifications
    const fetchAdminNotifications = async() => {
        try {
            const response = await axios.get('/adminNotifications/getNotificationsAdmin');
            setExpirationNotifications(response.data);
        } catch (error) {
            console.error('Error fetching expiration notifications:', error);
        }
    };

    //fetch low-stock product notifications
    const fetchLowStockNotifications = async() => {
        try {
            const response = await axios.get('/adminProduct/getOutOfStockProductsAdmin');
            const lowStockProducts = response.data;
            const notifications = lowStockProducts.map((product) => ({
                message: `${product.productName} (${product.sizeUnit.slice(0, 1)} - ${product.productSize}) is almost sold out! Only ${product.quantity} left.`,
            }));
            setLowStockNotifications(notifications);
        } catch (error) {
            console.error('Error fetching low-stock notifications:', error);
        }
    };

    useEffect(() => {
        const fetchAllNotifications = async() => {
            await fetchOrderNotifications();
            await fetchAdminNotifications();
            await fetchLowStockNotifications();
        };

        fetchAllNotifications();
    }, []);

  return (
    <div className='staff-notifications-order'>
        {/* <h2>Notifications</h2> */}
        <div className='notification-list-order'>
            {/* order notifications */}
            <div className='notification-category-order'>
                <h3>Order Notifications</h3>
                {
                    orderNotifications.length > 0 ? (
                        orderNotifications.map((notification, index) => {
                            const paymentMethod = notification.orderId?.paymentMethod; 
                            const orderLink =
                                paymentMethod === 'Pick Up'
                                    ? `/admin/orders-pickup/details/${notification.orderId._id}`
                                    : `/admin/orders/details/${notification.orderId._id}`;

                            return (
                                <div key={index} className='notification-item-order'>
                                    <Link to={orderLink}>
                                        {notification.message || notification}
                                    </Link>
                                </div>
                            );
                        })
                    ) : (
                        <div className='notification-item-order'>No order notifications</div>
                    )
                }
            </div>

            {/* expiration notifications */}
            <div className='notification-category-order'>
                <h3>Expiration Notifications</h3>
                {
                    expirationNotifications.length > 0 ? (
                        expirationNotifications.map((notification, index) => (
                            <div key={index} className='notification-item-order'>
                                <Link to='/admin/inventory/finished-product'>
                                    {notification.message || notification}
                                </Link>
                            </div>
                        ))
                    ) : (
                        <div className='notification-item-order'>No expiration notifications</div>
                    )
                }
            </div>

            {/* low stock notifications */}
            <div className='notification-category-order'>
                <h3>Low Stock Notifications</h3>
                {
                    lowStockNotifications.length > 0 ? (
                        lowStockNotifications.map((notification, index) => (
                            <div key={index} className='notification-item-order'>
                                <Link to='/admin/inventory/finished-product'>
                                    {notification.message}
                                </Link>
                            </div>
                        ))
                    ) : (
                        <div className='notification-item-order'>No low stock notifications</div>
                    )
                }
            </div>
        </div>
    </div>
  )
}

export default AdminNotificationsComponent
