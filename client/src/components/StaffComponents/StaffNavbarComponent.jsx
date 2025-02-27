import React, { useContext, useEffect, useState } from 'react'
import logoDepot from '../../assets/icons/logo-depot-3-circle.png';
import '../../CSS/StaffCSS/StaffNavbar.css';
import searchIcon from '../../assets/staff/stafficons/staff-navbar-search-icon.png'
import notificationIcon from '../../assets/admin/adminicons/admin-navbar-notification-icon.png';
import bottomAngleIcon from '../../assets/admin/adminicons/admin-navbar-bottomangle-icon.png';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { StaffContext } from '../../../contexts/StaffContexts/StaffAuthContext';

function StaffNavbarComponent() {
    const {staff} = useContext(StaffContext);
    const navigate = useNavigate();
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [notificationDropdownVisible, setNotificationDropdownVisible] = useState(false);
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
                isRead: false,
            }));
            setLowStockNotifications(notifications);
        } catch (error) {
            console.error('Error fetching low-stock notifications:', error);
        }
    };

    useEffect(() => {
        const fetchAllNotifications = async () => {
            await fetchOrderNotifications();
            await fetchAdminNotifications();
            await fetchLowStockNotifications();
        };

        fetchAllNotifications();
    }, []);

    const toggleDropdown = () => {
        setDropdownVisible(!dropdownVisible);
    };

    const toggleNotificationDropdown = () => {
        setNotificationDropdownVisible(!notificationDropdownVisible);
    };

    const handleConfirmLogout = async() => {
        try {
            const response = await axios.post('/adminAuth/logoutAdmin');
            if (response.data.message) {
                toast.success(response.data.message);
            }
            navigate('/admin-staff-login');
        } catch (error) {
            console.error(error);
            toast.error('Logout failed');
        }
    };

    //handle notification click to toggle isRead status and update in the backend
    const handleNotificationClick = async(index, type) => {
        //set isRead to true when clicked(permanent read)
        const allNotifications = [
            ...orderNotifications,
            ...expirationNotifications,
            ...lowStockNotifications,
        ];
    
        const notification = allNotifications[index];
        notification.isRead = true; //ensure the notification is marked as read permanently
    
        //update state to reflect the changes
        setOrderNotifications([...orderNotifications]);
        setExpirationNotifications([...expirationNotifications]);
        setLowStockNotifications([...lowStockNotifications]);
    
        setNotificationDropdownVisible(false);
    
        try {
            //send request to backend to update the notification status permanently
            await axios.put(`/adminNotifications/updateNotificationStatus/${notification._id}`, {
                isRead: true,
                notificationType: type,  //send type ('order', 'expiration', or 'lowStock')
            });
        } catch (error) {
            console.error('Error updating notification status:', error);
            toast.error('Failed to update notification status');
        }
    };
    

    //combine all notifications
    const allNotifications = [
        ...orderNotifications.map(notification => ({ type: 'order', ...notification })),
        ...expirationNotifications.map(notification => ({ type: 'expiration', ...notification })),
        ...lowStockNotifications.map(notification => ({ type: 'lowStock', ...notification }))
    ];

  return (
    <nav className='staff-navbar'>
        <div className='staff-navbar-container'>
            <div className='staff-navbar-logo'>
                <img src={logoDepot} className='logo-depot' alt='Logo' />
                {/* <span className='sabon'>SABON</span>
                &nbsp;
                <span className='depot'>DEPOT</span> */}
            </div>


            <div className='staff-navbar-content'>
                <form action="">
                    {/* <input type="text" placeholder='Search product or any order...' className='search-input' />
                    <button type="submit" className='search-button'>
                        <img src={searchIcon} alt="" />
                    </button> */}
                </form>

                <div className='staff-navbar-profile'>
                <div className='notification-container'>
                        <img 
                        src={notificationIcon} 
                        alt="Notification" 
                        className='notification-icon' 
                        onClick={toggleNotificationDropdown}
                        />
                        {/* <span className='notification-count'>{notifications.length}</span> */}
                        <span className='notification-count'>
                            {allNotifications.filter(notification => !notification.isRead).length}
                        </span>
                        {/* {
                            notificationDropdownVisible && (
                                <div className='notification-dropdown'>
                                    <h4>Notifications</h4>
                                    {
                                        notifications.length > 0 ? (
                                            notifications.map((notification, index) => (
                                                <div key={index} className='notification-items'>
                                                    <Link
                                                        to={notification.link || '/staff/products'}
                                                        className='notification-item'
                                                        onClick={handleNotificationClick}
                                                    >
                                                        {notification.message}
                                                    </Link>
                                                </div>
                                            ))
                                        ) : (
                                            <div className='notification-item'>No new notifications</div>
                                        )
                                    }
                                </div>
                            )
                        } */}
                        {
                            notificationDropdownVisible && (
                                <div className='notification-dropdown'>
                                    <h4>Notifications</h4>
                                    {
                                        allNotifications.length > 0 ? (
                                            <>
                                                {/* order notifications section */}
                                                {
                                                    orderNotifications.map((notification, index) => {
                                                        const paymentMethod = notification.orderId?.paymentMethod;
                                                        const orderLink =
                                                            paymentMethod === 'Pick Up'
                                                                ? `/staff/orders-pickup/details/${notification.orderId._id}`
                                                                : `/staff/orders/details/${notification.orderId._id}`;

                                                        return (
                                                            <div key={index} className='notification-items'>
                                                                <Link 
                                                                to={orderLink}
                                                                className={`notification-item ${notification.isRead ? 'read' : 'unread'}`}
                                                                onClick={() => handleNotificationClick(index, 'order')}
                                                                >
                                                                    {notification.message}
                                                                    <br />
                                                                    <small>{new Date(notification.createdAt).toLocaleString()}</small>
                                                                </Link>
                                                            </div>
                                                        );
                                                    })
                                                }


                                                {/* expiration notifications section */}
                                                {
                                                    expirationNotifications.length > 0 && (
                                                        <>
                                                            <h4>Expiration Notifications</h4>
                                                            {
                                                                expirationNotifications.map((notification, index) => (
                                                                    <div key={index} className='notification-items'>
                                                                        <Link 
                                                                        to='/staff/products' 
                                                                        className={`notification-item ${notification.isRead ? 'read' : 'unread'}`}
                                                                        onClick={() => handleNotificationClick(index, 'expiration')}
                                                                        >
                                                                            {notification.message}
                                                                        </Link>
                                                                    </div>
                                                                ))
                                                            }
                                                        </>
                                                    )
                                                }

                                                {/* low stock notifications section */}
                                                {
                                                    lowStockNotifications.length > 0 && (
                                                        <>
                                                            <h4>Low Stock Notifications</h4>
                                                            {
                                                                lowStockNotifications.map((notification, index) => (
                                                                    <div key={index} className='notification-items'>
                                                                        <Link 
                                                                        to='/staff/products' 
                                                                        className={`notification-item ${notification.isRead ? 'read' : 'unread'}`}
                                                                        onClick={() => handleNotificationClick(index, 'lowStock')}
                                                                        >
                                                                            {notification.message}
                                                                        </Link>
                                                                    </div>
                                                                ))
                                                            }
                                                        </>
                                                    )
                                                }
                                            </>
                                        ) : (
                                            <div className='notification-item'>No new notifications</div>
                                        )
                                    }
                                </div>
                            )
                        }
                    </div>


                    <div className='profile-info'>
                        {
                            !!staff && (
                                <>
                                    <span className='profile-name'>{staff.fullName}</span>
                                    <span className='profile-role'>Staff</span>
                                </>
                            )
                        }
                    </div>
                    <img src={bottomAngleIcon} alt="Dropdown Icon" className='dropdown-icon' onClick={toggleDropdown} />
                    {
                        dropdownVisible && (
                            <div className='dropdown-menu'>
                                <button onClick={handleConfirmLogout}>Logout</button>
                            </div>
                        )
                    }
                </div>
            </div>
        </div>
    </nav>
  )
}

export default StaffNavbarComponent
