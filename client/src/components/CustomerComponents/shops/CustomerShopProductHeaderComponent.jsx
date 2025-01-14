import React from 'react'
import '../../../CSS/CustomerCSS/Shop/CustomerShopHeader.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleRight } from '@fortawesome/free-solid-svg-icons'

function CustomerShopProductHeaderComponent() {
  return (
    <div className='customer-shop-header'>
        <h1>Shop</h1>
        <h6>
            <span>Home</span>
            <FontAwesomeIcon icon={faAngleRight} />
            <span>Shop</span>
            <FontAwesomeIcon icon={faAngleRight} />
            <span>Product</span>
        </h6>
    </div>
  )
}

export default CustomerShopProductHeaderComponent