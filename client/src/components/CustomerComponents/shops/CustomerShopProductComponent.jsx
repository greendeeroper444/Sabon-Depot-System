// import React, { useContext, useState } from 'react'
// import '../../../CSS/CustomerCSS/Shop/CustomerShopContent.css';
// import { Link, useSearchParams } from 'react-router-dom';
// import { CustomerContext } from '../../../../contexts/CustomerContexts/CustomerAuthContext';
// import UseFetchCategoriesHook from '../../../hooks/CustomerHooks/UseFetchCategoriesHook';
// import UseFetchProductsHook from '../../../hooks/CustomerHooks/UseFetchProductsHook';

// function CustomerShopProductContentComponent() {
//     const [selectedCategory, setSelectedCategory] = useState('');
//     const {customer} = useContext(CustomerContext);
//     const [showCount, setShowCount] = useState(16);
//     const [searchParams] = useSearchParams();
//     const sizeUnit = searchParams.get('sizeUnit') || '';
//     const { products, loading, error } = UseFetchProductsHook(selectedCategory, sizeUnit);

//     const categories = UseFetchCategoriesHook();
//     // const {products, loading, error} = UseFetchProductsHook(selectedCategory);

//     if(loading){
//         return <div>Loading...</div>;
//     }

//     if(error){
//         return <div>Error: {error.message}</div>;
//     }

//      //check if the customer is new and eligible for the discount
//      const isNewCustomer = customer?.isNewCustomer && new Date() < new Date(customer?.newCustomerExpiresAt);

//   return (
//     <div className='customer-shop-content-container'>
//         <div className='customer-shop-content-header'>
//             <div className='customer-shop-content-header-left'>
//                 <div>
//                     <select 
//                     name='category' 
//                     id="category"
//                     value={selectedCategory}
//                     onChange={(e) => setSelectedCategory(e.target.value)}
//                     >
//                         <option value="">All Products</option>
//                         {
//                             categories.map((category) => (
//                                 <option key={category} value={category}>{category}</option>
//                             ))
//                         }
//                     </select>
//                 </div>
//                 <div>
//                     <span>Showing {products.length} results</span>
//                 </div>
//             </div>
//             <div className='customer-shop-content-header-section-right'>
//                 <span>Show</span>
//                 <button onClick={() => setShowCount(showCount === 16 ? 32 : 16)}>
//                     {showCount}
//                 </button>
//             </div>
//         </div>

//         <div className='shop-products-content'>
//             <ul>
//                 {
//                     products.map((product, index) => {
//                         const discount = isNewCustomer ? 30 : product.discountPercentage;
//                         // const shouldShowDiscount = IsDiscountValidUtils(customer) && product.discountPercentage > 0;
//                         // const shouldShowDiscount = product.discountPercentage > 0;
//                         const shouldShowDiscount = discount > 0;
//                         // const finalPrice = shouldShowDiscount ? product.discountedPrice.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2}) : product.price.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});
//                         const finalPrice = shouldShowDiscount 
//                                 ? (product.price - (product.price * (discount / 100))).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})
//                                 : product.price.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});
//                         const originalPrice = product.price.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});

//                         return (
//                             <li key={product._id}>
//                                 <div>
//                                     <div className='product-image-container'>
//                                         <img src={`${product.imageUrl}`} alt={product.productName} />
//                                         {
//                                             index === products.length - 1 && (
//                                                 <div className='new-badge'>New</div>
//                                             )
//                                         }
//                                         {
//                                             shouldShowDiscount && (
//                                                 <div className='discount-badge'>
//                                                     {discount}% OFF
//                                                 </div>
//                                             )
//                                         }
//                                     </div>
//                                     <div className='details-list'>
//                                         <h5>{product.productName} ({product.productSize})
//                                             {' '}
//                                             <span className='out-of-stock'>
//                                                 {product.quantity <= 0 ? '(Out of Stock)' : ''}
//                                             </span>
//                                         </h5>
//                                         <span>{product.category}</span>
//                                         <div className='price-container'>
//                                             {
//                                                 shouldShowDiscount && (
//                                                     <h4 className='final-price line-through'>
//                                                         ₱ {originalPrice}
//                                                     </h4>
//                                                 )
//                                             }
//                                             <h4 className='final-price'>
//                                                 ₱ {finalPrice}
//                                             </h4>
//                                         </div>
//                                     </div>
//                                 </div>
//                                 <div className='view-details'>
                                    
//                                     <Link to={`/shop/product/details/${product._id}`}>View Details</Link>
//                                 </div>
//                             </li>
//                         );
//                     })
//                 }
//             </ul>
//         </div>
//     </div>
//   )
// }

// export default CustomerShopProductContentComponent

import React, { useContext, useState } from 'react'
import '../../../CSS/CustomerCSS/Shop/CustomerShopContent.css';
import { Link, useSearchParams } from 'react-router-dom';
import { CustomerContext } from '../../../../contexts/CustomerContexts/CustomerAuthContext';
import UseFetchCategoriesHook from '../../../hooks/CustomerHooks/UseFetchCategoriesHook';
import UseFetchProductsHook from '../../../hooks/CustomerHooks/UseFetchProductsHook';

function CustomerShopProductContentComponent() {
    const [selectedCategory, setSelectedCategory] = useState('');
    const {customer} = useContext(CustomerContext);
    const [showCount, setShowCount] = useState(16);
    const [searchParams] = useSearchParams();
    const sizeUnit = searchParams.get('sizeUnit') || '';
    const { products, loading, error } = UseFetchProductsHook(selectedCategory, sizeUnit);

    const categories = UseFetchCategoriesHook();

    if(loading){
        return <div>Loading...</div>;
    }

    if(error){
        return <div>Error: {error.message}</div>;
    }

    const isNewCustomer = customer?.isNewCustomer && new Date() < new Date(customer?.newCustomerExpiresAt);

    const getDaysLeftMessage = (discountedDate) => {
        const now = new Date();
        const endDate = new Date(discountedDate);
        const timeDiff = endDate - now;

        if(timeDiff > 0){
            const daysLeft = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
            if(daysLeft === 3) return '3 days left';
            if(daysLeft === 2) return '2 days left';
            if(daysLeft === 1) return '1 day left';
        }

        return null;
    };

  return (
    <div className='customer-shop-content-container'>
        <div className='customer-shop-content-header'>
            <div className='customer-shop-content-header-left'>
                <div>
                    <select
                    name='category'
                    id="category"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    >
                        <option value="">All Products</option>
                        {
                            categories.map((category) => (
                                <option key={category} value={category}>{category}</option>
                            ))
                        }

                    </select>
                </div>
                <div>
                    <span>Showing {products.length} results</span>
                </div>
            </div>
            <div className='customer-shop-content-header-section-right'>
                <span>Show</span>
                <button onClick={() => setShowCount(showCount === 16 ? 32 : 16)}>
                    {showCount}
                </button>
            </div>
        </div>

        <div className='shop-products-content'>
            <ul>
                {
                    products.map((product, index) => {
                        const discount = isNewCustomer ? 30 : product.discountPercentage;
                        const shouldShowDiscount = discount > 0;
                        const finalPrice = shouldShowDiscount
                            ? (product.price - (product.price * (discount / 100))).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                            : product.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                        const originalPrice = product.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                        const daysLeftMessage = shouldShowDiscount ? getDaysLeftMessage(product.discountedDate) : null;

                        return (
                            <li key={product._id}>
                                <div>
                                    <div className='product-image-container'>
                                        <img src={`${product.imageUrl}`} alt={product.productName} />
                                        {index === products.length - 1 && <div className='new-badge'>New</div>}
                                        {
                                            shouldShowDiscount && (
                                                <div className='discount-badge'>
                                                    {discount}% OFF
                                                </div>
                                            )
                                        }
                                        {
                                            daysLeftMessage && (
                                                <span className='days-left'>{daysLeftMessage}</span>
                                            )
                                        }
                                    </div>
                                    <div className='details-list'>
                                        <h5>{product.productName} ({product.productSize})
                                            {' '}
                                            <span className='out-of-stock'>
                                                {product.quantity <= 0 ? '(Out of Stock)' : ''}
                                            </span>
                                        </h5>
                                        <span>{product.category}</span>
                                        <br />
                                        <span>{product.quantity.toLocaleString('en-US')}</span> quantity
                                        <div className='price-container'>
                                            {
                                                shouldShowDiscount && (
                                                    <h4 className='final-price line-through'>
                                                        ₱ {originalPrice}
                                                    </h4>
                                                )
                                            }
                                            <h4 className='final-price'>
                                                ₱ {finalPrice}
                                            </h4>
                                        </div>
                                    </div>
                                </div>
                                <div className='view-details'>
                                    <Link to={`/shop/product/details/${product._id}`}>View Details</Link>
                                </div>
                            </li>
                        );
                    })
                }
            </ul>
        </div>
    </div>
  )
}

export default CustomerShopProductContentComponent
