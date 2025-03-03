import React, {useContext, useState } from 'react'
import '../../../CSS/StaffCSS/StaffPayment.css';
import UseFetchCategoriesRefillProductHook from '../../../hooks/AdminHooks/UseFetchCategoriesRefillProductHook';
import AdminDirectOrdersRefillContentComponent from '../../../components/AdminComponents/AdminPos/AdminDirectOrdersRefillContentComponent';

import { AdminContext } from '../../../../contexts/AdminContexts/AdminAuthContext';
import AdminModalRefillingContentDetailsComponent from '../../../components/AdminComponents/AdminPos/modals/AdminModalRefillingContentDetailsComponent';
import UseCartRefillHook from '../../../hooks/AdminHooks/UseCartRefillHook';
import UseFetchRefillProductsHook from '../../../hooks/AdminHooks/UseFetchRefillProductsHook';

function AdminQuickSalesRefillPage() {
    const [selectedCategory, setSelectedCategory] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProductId, setSelectedProductId] = useState(null);


    
    const categories = UseFetchCategoriesRefillProductHook();
    const {refillProducts, loading, error} = UseFetchRefillProductsHook(selectedCategory);
    const {admin} = useContext(AdminContext);
    const {cartItemsRefill, setCartItemsRefill, handleAddToCartClickRefill} = UseCartRefillHook(admin);


    const handleAddToCartRefill = async (productId) => {
        const success = await handleAddToCartClickRefill(admin?._id, productId, 1);
        if(success){
            setSelectedProductId(productId);
            setIsModalOpen(true);
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedProductId(null);
    };


    if(loading) return <div>Loading...</div>;
    if(error) return <div>Error: {error.message}</div>

  return (
    <>
    <div className='staff-payment-container'>
        <div className='customer-shop-content-container'>
            <div className='staff-shop-content-header'>
                <div className='staff-shop-content-header-left'>
                    <div>
                        <select 
                        name="category" 
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
                        <span>Showing {refillProducts.length} results</span>
                    </div>
                </div>
                {/* select of walkin or refilling */}
                {/* <div>
                    <select
                    name="orderType"
                    id="orderType"
                    value={orderType}
                    onChange={(e) => setOrderType(e.target.value)}
                    >
                        <option value="Walkin">Walkin Order</option>
                        <option value="Refilling">Refilling</option>
                    </select>
                </div> */}
                <div>
                   
                </div>

                {/* second select for productSize */}
                <div>
                    
                </div>
                {/* <div className='staff-shop-content-header-section-right'>
                    <span>Show</span>
                    <button>16</button>
                </div> */}

                
            </div>
            <AdminDirectOrdersRefillContentComponent
            onAddToCart={handleAddToCartRefill}
            cartItems={cartItemsRefill}
            setCartItems={setCartItemsRefill}
            admin={admin}
            selectedCategory={selectedCategory}
            />
        </div>
    </div>


    <AdminModalRefillingContentDetailsComponent
    isOpen={isModalOpen}
    onClose={handleCloseModal}
    cartItems={cartItemsRefill}
    setCartItems={setCartItemsRefill}
    adminId={admin?._id}
    />
        
    </>
  )
}

export default AdminQuickSalesRefillPage