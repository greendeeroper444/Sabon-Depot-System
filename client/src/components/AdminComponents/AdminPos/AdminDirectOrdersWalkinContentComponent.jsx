import React, { useState } from 'react'
import '../../../CSS/CustomerCSS/Shop/CustomerShopContent.css';
import UseFetchProductsHook from '../../../hooks/StaffHooks/UseFetchProductsHook';
import IsDiscountValidUtils from '../../../utils/IsDiscountValidUtils';
import { Link } from 'react-router-dom';

function AdminDirectOrdersWalkinContentComponent({
    onAddToCart, 
    cartItems, 
    setCartItems, 
    admin,
    selectedSizeUnit, 
    selectedProductSize,
    categories,
    selectedCategory
}) {
    const {products, loading, error} = UseFetchProductsHook(selectedCategory);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    //filter products based on selected sizeUnit and productSize
    const filteredProducts = products.filter(product => {
        const categoryMatches = selectedCategory ? product.category === selectedCategory : true;
        const sizeUnitMatches = selectedSizeUnit ? product.sizeUnit === selectedSizeUnit : true;
        const productSizeMatches = selectedProductSize ? product.productSize === selectedProductSize : true;
        return categoryMatches && sizeUnitMatches && productSizeMatches;
    });
    


    const totalItems = filteredProducts.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

    const handlePageChange = (page) => {
        if(page > 0 && page <= totalPages){
            setCurrentPage(page);
        }
    };

    if(loading) return <div>Loading...</div>;
    if(error) return <div>Error: {error.message}</div>;


  return (
    <div className='shop-products-content'>
        <div className='shop-products-contents'>
            <ul>
                {
                    paginatedProducts.map((product, index) => {
                        const shouldShowDiscount = IsDiscountValidUtils(admin) && product.discountPercentage > 0;
                        const finalPrice = shouldShowDiscount ? product.discountedPrice.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2}) : product.price.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});

                        return (
                            <li key={product._id}>
                                <div>
                                    <div className='product-image-admin-container'>
                                        <img src={`${product.imageUrl}`} alt={product.productName} />
                                        {index === products.length - 1 && <div className='new-badge'>New</div>}
                                        {shouldShowDiscount && <div className='discount-badge'>{product.discountPercentage}% OFF</div>}
                                    </div>
                                    <div className='details-list'>
                                        <h5>{product.productName} ({product.productSize})</h5>
                                        <span>{product.category}</span>
                                        <br />
                                        <span>{product.quantity.toLocaleString('en-US')}</span> quantity
                                        <h6>{`₱${finalPrice}`}</h6>
                                    </div>
                                </div>
                                <div className='view-details'>
                                    <Link onClick={() => onAddToCart(product._id)}>Add To Cart</Link>
                                </div>
                            </li>
                        );
                    })
                }
            </ul>
        </div>

        <div className='customer-shop-content-pagination'>
            <button
            className='page-item'
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
            >
                Previous
            </button>
            {
                [...Array(totalPages)].map((_, index) => (
                    <button
                    key={index}
                    className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}
                    onClick={() => handlePageChange(index + 1)}
                    >
                        {index + 1}
                    </button>
                ))
            }
            <button
            className='page-item'
            disabled={currentPage === totalPages}
            onClick={() => handlePageChange(currentPage + 1)}
            >
                Next
            </button>
        </div>
    </div>
  )
}

export default AdminDirectOrdersWalkinContentComponent
