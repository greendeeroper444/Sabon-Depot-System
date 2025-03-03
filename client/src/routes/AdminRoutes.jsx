// import React from 'react'
// import { AdminContextProvider } from '../../contexts/AdminContexts/AdminAuthContext'
// import AdminNavbarComponent from '../components/AdminComponents/AdminNavbarComponent'
// import AdminSidebarComponent from '../components/AdminComponents/AdminSidebarComponent'
// import AdminSidebarResponsiveComponent from '../components/AdminComponents/AdminSidebarResponsiveComponent'
// import { Route, Routes } from 'react-router-dom'
// import AdminDashboardPage from '../pages/AdminPage/AdminDashboardPage'
// import AdminOrdersPage from '../pages/AdminPage/AdminOrdersPage'
// import AdminOrdersDetailsPage from '../pages/AdminPage/AdminOrdersDetailsPage'
// import AdminFinishedProductPage from '../pages/AdminPage/InventoryPage/AdminFinishedProductPage'
// import AdminAccountsPage from '../pages/AdminPage/AdminAccountsPage'
// import InventoryReport from '../pages/AdminPage/ReportsPage/InventoryReport'
// import SalesReport from '../pages/AdminPage/ReportsPage/SalesReport'
// import AdminAccountDetails from '../pages/AdminPage/AdminAccountDetails'
// import AdminWorkinProgressPage from '../pages/AdminPage/InventoryPage/AdminWorkinProgressPage'
// import AdminOrdersWalkinPage from '../pages/AdminPage/AdminOrderWalkinPage'
// import AdminOrdersRefillPage from '../pages/AdminPage/AdminOrdersRefillPage'
// import AdminOrdersPickupPage from '../pages/AdminPage/AdminOrdersPickupPage'
// import AdminQuickSalesPage from '../pages/AdminPage/AdminQuickSalesPage'
// import AdminOrderSummaryPage from '../pages/AdminPage/AdminOrderSummaryPage'
// import AdminSettingsPage from '../pages/AdminPage/AdminSettingsPage'
// import AdminOrdersPickupDetailsPage from '../pages/AdminPage/AdminOrdersPickupDetails'

// function AdminRoutes({adminToggleSidebar, adminCloseSidebar, adminSidebarVisible}) {
//   return (
//     <AdminContextProvider>
//         <AdminNavbarComponent adminToggleSidebar={adminToggleSidebar} />
//         <AdminSidebarComponent />
//         <div className={`${adminSidebarVisible ? '' : 'admin-sidebar-hide'}`}>
//             <AdminSidebarResponsiveComponent adminCloseSidebar={adminCloseSidebar} />
//         </div>
//         <div className='admin-main-container'>
//             <Routes>
//                 <Route path='/admin/dashboard' element={<AdminDashboardPage />} />
//                 <Route path='/admin/orders' element={<AdminOrdersPage />} />
//                 <Route path='/admin/orders-pickup' element={<AdminOrdersPickupPage />} />
//                 <Route path='/admin/orders/details/:orderId' element={<AdminOrdersDetailsPage />} />
//                 <Route path='/admin/orders-pickup/details/:orderId' element={<AdminOrdersPickupDetailsPage />} />
//                 <Route path='/admin/walkins' element={<AdminOrdersWalkinPage />} />
//                 <Route path='/admin/refills' element={<AdminOrdersRefillPage />} />
//                 <Route path='/admin/inventory/finished-product' element={<AdminFinishedProductPage />} />
//                 <Route path='/admin/inventory/workin-progress' element={<AdminWorkinProgressPage />} />
//                 <Route path='/admin/accounts' element={<AdminAccountsPage />} />
//                 <Route path='/admin/reports/inventory-report' element={<InventoryReport />} />
//                 <Route path='/admin/reports/sales-report' element={<SalesReport />} />
//                 <Route path='/admin/accounts/:id' element={<AdminAccountDetails />} />
//                 <Route path='/admin/quick-sales' element={<AdminQuickSalesPage />} />
//                 <Route path='/admin/order-summary/:orderId' element={<AdminOrderSummaryPage/>} />
//                 <Route path='/admin/settings' element={<AdminSettingsPage />} />
//             </Routes>
//         </div>
//     </AdminContextProvider>
//   )
// }

// export default AdminRoutes

import React from 'react'
import { AdminContextProvider } from '../../contexts/AdminContexts/AdminAuthContext'
import { matchPath, useLocation } from 'react-router-dom'
import AdminNavbarComponent from '../components/AdminComponents/AdminNavbarComponent'
import AdminSidebarComponent from '../components/AdminComponents/AdminSidebarComponent'
import AdminSidebarResponsiveComponent from '../components/AdminComponents/AdminSidebarResponsiveComponent'
import { Route, Routes } from 'react-router-dom'
import AdminDashboardPage from '../pages/AdminPage/AdminDashboardPage'
import AdminOrdersPage from '../pages/AdminPage/AdminOrdersPage'
import AdminOrdersDetailsPage from '../pages/AdminPage/AdminOrdersDetailsPage'
import AdminFinishedProductPage from '../pages/AdminPage/InventoryPage/AdminFinishedProductPage'
import AdminAccountsPage from '../pages/AdminPage/AdminAccountsPage'
import InventoryReport from '../pages/AdminPage/ReportsPage/InventoryReport'
import SalesReport from '../pages/AdminPage/ReportsPage/SalesReport'
import AdminAccountDetails from '../pages/AdminPage/AdminAccountDetails'
import AdminWorkinProgressPage from '../pages/AdminPage/InventoryPage/AdminWorkinProgressPage'
import AdminOrdersWalkinPage from '../pages/AdminPage/AdminOrderWalkinPage'
import AdminOrdersRefillPage from '../pages/AdminPage/AdminOrdersRefillPage'
import AdminOrdersPickupPage from '../pages/AdminPage/AdminOrdersPickupPage'
import AdminQuickSalesPage from '../pages/AdminPage/AdminQuickSalesPage'
import AdminOrderSummaryPage from '../pages/AdminPage/AdminOrderSummaryPage'
import AdminSettingsPage from '../pages/AdminPage/AdminSettingsPage'
import AdminOrdersPickupDetailsPage from '../pages/AdminPage/AdminOrdersPickupDetails'
import AdminRefillProductPage from '../pages/AdminPage/InventoryPage/AdminRefillProductPage'
import AdminQuickSalesWalkinPage from '../pages/AdminPage/QuickSalesPage/AdminQuickSalesWalkinPage'
import AdminQuickSalesRefillPage from '../pages/AdminPage/QuickSalesPage/AdminQuickSalesRefillPage'
import AdminOrderSummaryRefillPage from '../pages/AdminPage/AdminOrderSummaryRefillPage'

function AdminRoutes({adminToggleSidebar, adminCloseSidebar, adminSidebarVisible}) {
    const location = useLocation()

    //list of routes where the AdminNavbarComponent should be hidden
    //   const noNavbarRoutes = ['/admin/settings/:adminId']
    //check if the current route matches the dynamic admin settings route
    const isSettingsPage = matchPath('/admin/settings', location.pathname)

  return (
    <AdminContextProvider>
        {/* conditionally render AdminNavbarComponent */}
        {/* {
            !noNavbarRoutes.includes(location.pathname) && (
                <AdminNavbarComponent adminToggleSidebar={adminToggleSidebar} />
            )
        } */}
        {
            !isSettingsPage && (
                <AdminNavbarComponent adminToggleSidebar={adminToggleSidebar} />
            )
        }
        <AdminSidebarComponent />
        <div className={`${adminSidebarVisible ? '' : 'admin-sidebar-hide'}`}>
            <AdminSidebarResponsiveComponent adminCloseSidebar={adminCloseSidebar} />
        </div>
        <br />
        <div className='admin-main-container'>
            <Routes>
                <Route path='/admin/dashboard' element={<AdminDashboardPage />} />
                <Route path='/admin/orders' element={<AdminOrdersPage />} />
                <Route path='/admin/orders-pickup' element={<AdminOrdersPickupPage />} />
                <Route path='/admin/orders/details/:orderId' element={<AdminOrdersDetailsPage />} />
                <Route path='/admin/orders-pickup/details/:orderId' element={<AdminOrdersPickupDetailsPage />} />
                <Route path='/admin/walkins' element={<AdminOrdersWalkinPage />} />
                <Route path='/admin/refills' element={<AdminOrdersRefillPage />} />
                <Route path='/admin/inventory/finished-product' element={<AdminFinishedProductPage />} />
                <Route path='/admin/inventory/workin-progress' element={<AdminWorkinProgressPage />} />
                <Route path='/admin/inventory/refill-product' element={<AdminRefillProductPage />} />
                <Route path='/admin/quicksales/sales-walkin' element={<AdminQuickSalesWalkinPage />} />
                <Route path='/admin/quicksales/sales-refill' element={<AdminQuickSalesRefillPage />} />
                <Route path='/admin/accounts' element={<AdminAccountsPage />} />
                <Route path='/admin/reports/inventory-report' element={<InventoryReport />} />
                <Route path='/admin/reports/sales-report' element={<SalesReport />} />
                <Route path='/admin/accounts/:id' element={<AdminAccountDetails />} />
                <Route path='/admin/quick-sales' element={<AdminQuickSalesPage />} />
                <Route path='/admin/order-summary/:orderId' element={<AdminOrderSummaryPage />} />
                <Route path='/admin/order-summary-refill/:orderId' element={<AdminOrderSummaryRefillPage />} />
                <Route path='/admin/settings/:adminId' element={<AdminSettingsPage />} />
            </Routes>
        </div>
    </AdminContextProvider>
  )
}

export default AdminRoutes
