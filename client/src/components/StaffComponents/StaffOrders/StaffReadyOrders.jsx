import React from 'react'
import OrdersPickupTable from './OrdersPickupTable'

function StaffReadyOrders({orders, handleRowClick, orderDate}) {
  return (
    <OrdersPickupTable
        orders={orders} 
        handleRowClick={handleRowClick} 
        orderDate={orderDate} 
        noOrdersMessage='No ready order yet' 
    />
  )
}

export default StaffReadyOrders