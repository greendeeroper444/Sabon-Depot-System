import React from 'react'
import '../../../CSS/CustomerCSS/Shop/CustomerShopHeader.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleRight } from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom';

function CustomerShopHeaderComponent() {
  return (
    <div className='customer-shop-header'>
        <h1>Shop</h1>
        <h6>
          <span><Link to='/' style={{ textDecoration: 'none', color: 'black' }}>Home</Link></span>
          <FontAwesomeIcon icon={faAngleRight} />
          <span><Link to='/shop' style={{ textDecoration: 'none', color: 'black' }}>Shop</Link></span>
        </h6>
    </div>
  )
}

export default CustomerShopHeaderComponent