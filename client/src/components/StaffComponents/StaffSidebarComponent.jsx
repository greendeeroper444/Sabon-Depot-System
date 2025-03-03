import React, { useContext, useState } from 'react'
import '../../CSS/AdminCSS/AdminSidebar.css';
import { NavLink } from 'react-router-dom';
import logoDepot from '../../assets/icons/logo-depot-3-circle.png';
import dashboardIcon from '../../assets/admin/adminicons/admin-sidebar-dashboard-icon.png';
import dashboardIconWhite from '../../assets/admin/adminicons/admin-sidebar-dashboard-icon-white.png';
import ordersIcon from '../../assets/admin/adminicons/admin-sidebar-orders-icon.png';
import inventoryIcon from '../../assets/admin/adminicons/admin-sidebar-inventory-report-icon.png';
import accountsIcon from '../../assets/admin/adminicons/admin-sidebar-accounts-icon.png';
import accountsIconWhite from '../../assets/admin/adminicons/admin-sidebar-accounts-icon-white.png';
import reportsIcon from '../../assets/admin/adminicons/admin-sidebar-inventory-report-icon.png';
import quickSalesIcon from '../../assets/admin/adminicons/quick-sales.png';
import quickSalesIconWhite from '../../assets/admin/adminicons/quick-sales-white.png';
import settingsIcon from '../../assets/admin/adminicons/settings.png';
import settingsIconWhite from '../../assets/admin/adminicons/settings-white.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons';
import { StaffContext } from '../../../contexts/StaffContexts/StaffAuthContext';

function StaffSidebarComponent() {
    const {staff} = useContext(StaffContext);
    const [isDropdownOpenInventory, setIsDropdownOpenInventory] = useState(false);
    const [isDropdownOpenReports, setIsDropdownOpenReports] = useState(false);
    const [isDropdownTransaction, setIsDropdownTransaction] = useState(false);
    const [isDropdownOpenQuickSales, setIsDropdownOpenQuickSales] = useState(false);

    const toggleDropdownTransaction = () => {
        setIsDropdownTransaction(!isDropdownTransaction);
    };
    const toggleDropdownInventory = () => {
        setIsDropdownOpenInventory(!isDropdownOpenInventory);
    };

    const toggleDropdownReports = () => {
        setIsDropdownOpenReports(!isDropdownOpenReports);
    };
    const toggleDropdownQuickSales = () => {
        setIsDropdownOpenQuickSales(!isDropdownOpenQuickSales);
    };

  return (
    <div className='admin-sidebar original-admin-sidebar'>
        <div className='admin-sidebar-header'>
            <img src={logoDepot} alt="Logo" className='logo' />
            <h2>Staff</h2>
        </div>
        <ul className='admin-sidebar-list'>
            <li>
                <NavLink to='/staff/dashboard' className='admin-sidebar-item' activeClassName='active'>
                    <img src={dashboardIcon} alt="Dashboard" className='sidebar-icon' />
                    <img src={dashboardIconWhite} alt="Orders" className='sidebar-icon-active' />
                    <span>Dashboard</span>
                </NavLink>
            </li>
            <li>
                <div className='admin-sidebar-item' onClick={toggleDropdownTransaction}>
                    <img src={ordersIcon} alt="Inventory" className='sidebar-icon' />
                    <span>Transaction</span>
                    <FontAwesomeIcon icon={isDropdownTransaction ? faAngleUp : faAngleDown} />
                </div>
                {
                    isDropdownTransaction && (
                        <div className='admin-sidebar-item-dropdown'>
                            <NavLink to='/staff/orders' className='admin-sidebar-item' activeClassName='active'>
                                <span>Online</span>
                            </NavLink>
                            <NavLink to='/staff/orders-pickup' className='admin-sidebar-item' activeClassName='active'>
                                <span>Pick Up</span>
                            </NavLink>
                            <NavLink to='/staff/walkins' className='admin-sidebar-item' activeClassName='active'>
                                <span>Walkin</span>
                            </NavLink>
                            <NavLink to='/staff/refills' className='admin-sidebar-item' activeClassName='active'>
                                <span>Refill</span>
                            </NavLink>
                        </div>
                    )
                }
            </li>
            {/* <li>
                <NavLink to='/admin/orders' className='admin-sidebar-item' activeClassName='active'>
                    <img src={ordersIcon} alt="Orders" className='sidebar-icon' />
                    <img src={ordersIconWhite} alt="Orders" className='sidebar-icon-active' />
                    <span>Orders</span>
                </NavLink>
            </li> */}
            <li>
                <div className='admin-sidebar-item' onClick={toggleDropdownInventory}>
                    <img src={inventoryIcon} alt="Inventory" className='sidebar-icon' />
                    <span>Inventory</span>
                    <FontAwesomeIcon icon={isDropdownOpenInventory ? faAngleUp : faAngleDown} />
                </div>
                {
                    isDropdownOpenInventory && (
                        <div className='admin-sidebar-item-dropdown'>
                            <NavLink to='/staff/inventory/finished-product' className='admin-sidebar-item' activeClassName='active'>
                                <span>Finished Goods</span>
                            </NavLink>
                            <NavLink to='/staff/inventory/refill-product' className='admin-sidebar-item' activeClassName='active'>
                                <span>Refill Products</span>
                            </NavLink>
                        </div>
                    )
                }
            </li>
            {/* <li>
                <NavLink to='/admin/inventory/finished-product' className='admin-sidebar-item' activeClassName='active'>
                    <img src={inventoryIcon} alt="Inventory" className='sidebar-icon' />
                    <img src={inventoryIcon} alt="Inventory" className='sidebar-icon-active' />
                    <span>Inventory</span>
                </NavLink>
            </li> */}
            {/* <li>
                <NavLink to='/admin/quick-sales' className='admin-sidebar-item' activeClassName='active'>
                    <img src={quickSalesIcon} alt="Accounts" className='sidebar-icon' />
                    <img src={quickSalesIconWhite} alt="Acounts" className='sidebar-icon-active' />
                    <span>Quick Sales</span>
                </NavLink>
            </li> */}
             <li>
                <div className='admin-sidebar-item' onClick={toggleDropdownQuickSales}>
                    <img src={quickSalesIcon} alt="Inventory" className='sidebar-icon' />
                    <span>Sales</span>
                    <FontAwesomeIcon icon={isDropdownOpenQuickSales ? faAngleUp : faAngleDown} />
                </div>
                {
                    isDropdownOpenQuickSales && (
                        <div className='admin-sidebar-item-dropdown'>
                            <NavLink to='/staff/quicksales/sales-walkin' className='admin-sidebar-item' activeClassName='active'>
                                <span>Sales Walkin</span>
                            </NavLink>
                            <NavLink to='/staff/quicksales/sales-refill' className='admin-sidebar-item' activeClassName='active'>
                                <span>Sales Refill</span>
                            </NavLink>
                        </div>
                    )
                }
            </li>
            <li>
                <NavLink to='/staff/accounts' className='admin-sidebar-item' activeClassName='active'>
                    <img src={accountsIcon} alt="Accounts" className='sidebar-icon' />
                    <img src={accountsIconWhite} alt="Acounts" className='sidebar-icon-active' />
                    <span>Accounts</span>
                </NavLink>
            </li>
            <li>
                <NavLink to={`/staff/settings/${staff?._id}`} className='admin-sidebar-item' activeClassName='active'>
                    <img src={settingsIcon} alt="Accounts" className='sidebar-icon' />
                    <img src={settingsIconWhite} alt="Acounts" className='sidebar-icon-active' />
                    <span>Settings</span>
                </NavLink>
            </li>
        </ul>
    </div>
  )
}

export default StaffSidebarComponent