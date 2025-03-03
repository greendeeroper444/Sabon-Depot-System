import React from 'react'
import { StaffContextProvider } from '../../contexts/StaffContexts/StaffAuthContext'
import StaffNavbarComponent from '../components/StaffComponents/StaffNavbarComponent'
import StaffSidebarComponent from '../components/StaffComponents/StaffSidebarComponent'
import { Route, Routes } from 'react-router-dom'
import StaffProductsPage from '../pages/StaffPage/StaffProductsPage'
import StaffOrdersWalkinPage from '../pages/StaffPage/StaffOrdersWalkinPage'
// import StaffPaymentPage from '../pages/StaffPage/StaffPaymentPage'
import StaffOrdersPage from '../pages/StaffPage/StaffOrdersPage'
import StaffOrdersDetailsPage from '../pages/StaffPage/StaffOrdersDetailsPage'
import StaffSettingsPage from '../pages/StaffPage/StaffSettingsPage'
import StaffOrderSummaryPage from '../pages/StaffPage/StaffOrderSummaryPage'
import StaffDashboardPage from '../pages/StaffPage/StaffDashboardPage'
import StaffAccountsPage from '../pages/StaffPage/StaffAccountsPage'
import StaffDirectOrdersPage from '../pages/StaffPage/StaffDirectOrdersPage'
import StaffDirectOrdersDetailsPage from '../pages/StaffPage/StaffDirectOrdersDetailsPage'
import StaffOrdersRefillPage from '../pages/StaffPage/StaffOrdersRefillPage'
import StaffOrdersPickupPage from '../pages/StaffPage/StaffOrdersPickupPage'
import StaffOrdersPickupDetailsPage from '../pages/StaffPage/StaffOrdersPickupDetailsPage'
import StaffOrderSummaryRefillPage from '../pages/StaffPage/StaffOrderSummaryRefillPage'
import StaffQuickSalesWalkinPage from '../pages/StaffPage/StaffQuickSalesOrder/StaffQuickSalesWalkinPage'
import StaffQuickSalesRefillPage from '../pages/StaffPage/StaffQuickSalesOrder/StaffQuickSalesRefillPage'
import StaffRefillProductPage from '../pages/StaffPage/StaffRefillProductPage'

function StaffRoutes() {
  return (
    <StaffContextProvider>
        <StaffNavbarComponent />
        <StaffSidebarComponent />
        <div className='staff-main-container'>
            <Routes>
                <Route path='/staff/dashboard' element={<StaffDashboardPage />} />
                {/* <Route path='/staff/home' element={<StaffHomePage />} /> */}
                <Route path='/staff/inventory/finished-product' element={<StaffProductsPage />} />
                <Route path='/staff/inventory/refill-product' element={<StaffRefillProductPage />} />
                <Route path='/staff/direct-orders' element={<StaffDirectOrdersPage />} />
                <Route path='/staff/direct-orders/details/:productId' element={<StaffDirectOrdersDetailsPage />} />
                <Route path='/staff/walkins' element={<StaffOrdersWalkinPage />} />
                <Route path='/staff/refills' element={<StaffOrdersRefillPage />} />
                {/* <Route path='/staff/payment' element={<StaffPaymentPage />} /> */}
                <Route path='/staff/orders' element={<StaffOrdersPage />} />
                <Route path='/staff/orders-pickup' element={<StaffOrdersPickupPage />} />
                <Route path='/staff/order-summary/:orderId' element={<StaffOrderSummaryPage/>} />
                <Route path='/staff/order-summary-refill/:orderId' element={<StaffOrderSummaryRefillPage/>} />
                <Route path='/staff/orders/details/:orderId' element={<StaffOrdersDetailsPage />} />
                <Route path='/staff/orders-pickup/details/:orderId' element={<StaffOrdersPickupDetailsPage />} />
                <Route path='/staff/quicksales/sales-walkin' element={<StaffQuickSalesWalkinPage />} />
                <Route path='/staff/quicksales/sales-refill' element={<StaffQuickSalesRefillPage />} />
                <Route path='/staff/settings/:staffId' element={<StaffSettingsPage />} />
                <Route path='/staff/accounts' element={<StaffAccountsPage />} />
            </Routes>
        </div>
    </StaffContextProvider>
  )
}

export default StaffRoutes