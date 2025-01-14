import React from 'react'
import OrdersPickupTable from './OrdersPickupTable'

function StaffPickedupOrders({orders, handleRowClick, orderDate}) {
  return (
    <OrdersPickupTable
        orders={orders} 
        handleRowClick={handleRowClick} 
        orderDate={orderDate} 
        noOrdersMessage='No picked up yet' 
    />
  )
}

export default StaffPickedupOrders