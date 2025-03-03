import React, {useContext, useState } from 'react'
import '../../../CSS/StaffCSS/StaffPayment.css';
import UseFetchCategoriesRefillProductHook from '../../../hooks/StaffHooks/UseFetchCategoriesRefillProductHook';
import StaffDirectOrdersRefillContentComponent from '../../../components/StaffComponents/StaffPos/StaffDirectOrdersRefillContentComponent';

import { StaffContext } from '../../../../contexts/StaffContexts/StaffAuthContext';
import StaffModalRefillingContentDetailsComponent from '../../../components/StaffComponents/StaffPos/modals/StaffModalRefillingContentDetailsComponent';
import UseCartRefillHook from '../../../hooks/StaffHooks/UseCartRefillHook';
import UseFetchRefillProductsHook from '../../../hooks/StaffHooks/UseFetchRefillProductsHook';

function StaffQuickSalesRefillPage() {
    const [selectedCategory, setSelectedCategory] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProductId, setSelectedProductId] = useState(null);


    
    const categories = UseFetchCategoriesRefillProductHook();
    const {refillProducts, loading, error} = UseFetchRefillProductsHook(selectedCategory);
    const {staff} = useContext(StaffContext);
    const {cartItemsRefill, setCartItemsRefill, handleAddToCartClickRefill} = UseCartRefillHook(staff);


    const handleAddToCartRefill = async (productId) => {
        const success = await handleAddToCartClickRefill(staff?._id, productId, 1);
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
            <StaffDirectOrdersRefillContentComponent
            onAddToCart={handleAddToCartRefill}
            cartItems={cartItemsRefill}
            setCartItems={setCartItemsRefill}
            staff={staff}
            selectedCategory={selectedCategory}
            />
        </div>
    </div>


    <StaffModalRefillingContentDetailsComponent
    isOpen={isModalOpen}
    onClose={handleCloseModal}
    cartItems={cartItemsRefill}
    setCartItems={setCartItemsRefill}
    staffId={staff?._id}
    />
        
    </>
  )
}

export default StaffQuickSalesRefillPage