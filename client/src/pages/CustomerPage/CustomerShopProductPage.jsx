import React from 'react'
import CustomerShopHeaderComponent from '../../components/CustomerComponents/shops/CustomerShopHeaderComponent'
import CustomerShopContentComponent from '../../components/CustomerComponents/shops/CustomerShopContentComponent'
import CustomerFooterComponent from '../../components/CustomerComponents/CustomerFooterComponent'
import CustomerTopFooterComponent from '../../components/CustomerComponents/CustomerTopFooterComponent'
import CustomerShopProductContentComponent from '../../components/CustomerComponents/shops/CustomerShopProductComponent'
import CustomerShopProductHeaderComponent from '../../components/CustomerComponents/shops/CustomerShopProductHeaderComponent'

function CustomerShopProductPage() {
  return (
    <>
        <CustomerShopProductHeaderComponent />

        <CustomerShopProductContentComponent />

        <CustomerTopFooterComponent />
        
        <CustomerFooterComponent />
    </>
  )
}

export default CustomerShopProductPage