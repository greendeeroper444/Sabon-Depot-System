import React, { useState } from 'react'
import '../../../CSS/CustomerCSS/Shop/CustomerShopContent.css';
import { Link } from 'react-router-dom';
import UseFetchRefillProductsHook from '../../../hooks/AdminHooks/UseFetchRefillProductsHook';

function AdminDirectOrdersRefillContentComponent({
    onAddToCart,
    selectedCategory
}) {
    const {refillProducts, loading, error} = UseFetchRefillProductsHook(selectedCategory);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    //filter products based on selected sizeUnit and maximumSizeLiter
    const filteredRefillProducts = refillProducts.filter(product => {
        const categoryMatches = selectedCategory ? product.category === selectedCategory : true;
        return categoryMatches;
    });

    const totalItems = filteredRefillProducts.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedProducts = filteredRefillProducts.slice(startIndex, endIndex);

    const handlePageChange = (page) => {
        if (page > 0 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    if(loading) return <div>Loading...</div>;
    if(error) return <div>Error: {error.message}</div>;

  return (
        <div className='shop-products-content'>
            <br />
            <br />
            <div className='refill-shop-products-contents'>
                <ul className='refill-product-list'>
                    {
                        paginatedProducts.map((product) => {
                            const waterLevel = (product.volume / product.maximumSizeLiter) * 100;

                            return (
                                <li className='refill-product-item' key={product._id}>
                                    <div className='cylinder'>
                                        <div
                                            className='water'
                                            style={{ height: `${waterLevel}%`, background: product.color }}
                                        ></div>
                                    </div>
                                    <p>
                                        {product.productName} - {product.volume}L
                                    </p>
                                    <div className='view-details'>
                                        <Link onClick={() => onAddToCart(product._id)}>Refill</Link>
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
                {[...Array(totalPages)].map((_, index) => (
                    <button
                        key={index}
                        className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}
                        onClick={() => handlePageChange(index + 1)}
                    >
                        {index + 1}
                    </button>
                ))}
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

export default AdminDirectOrdersRefillContentComponent
