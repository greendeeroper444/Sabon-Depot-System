import React from 'react'
import OrdersPickupTable from './OrdersPickupTable'

function StaffAllOrdersPickup({orders, handleRowClick, orderDate}) {
  return (
    <OrdersPickupTable
        orders={orders} 
        handleRowClick={handleRowClick} 
        orderDate={orderDate} 
        noOrdersMessage='No orders yet' 
    />
  )
}

export default StaffAllOrdersPickup