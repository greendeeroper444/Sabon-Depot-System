import React, {useContext, useState } from 'react'
import '../../../CSS/StaffCSS/StaffPayment.css';
import UseFetchCategoriesHook from '../../../hooks/StaffHooks/UseFetchCategoriesHook';
import UseFetchProductsHook from '../../../hooks/StaffHooks/UseFetchProductsHook';
import StaffDirectOrdersWalkinContentComponent from '../../../components/StaffComponents/StaffPos/StaffDirectOrdersWalkinContentComponent';
import StaffModalWalkinContentDetailsComponent from '../../../components/StaffComponents/StaffPos/modals/StaffModalWalkinContentDetailsComponent';
import UseCartHook from '../../../hooks/StaffHooks/UseCartHook';
import { StaffContext } from '../../../../contexts/StaffContexts/StaffAuthContext';
import UseCartRefillHook from '../../../hooks/StaffHooks/UseCartRefillHook';

function StaffQuickSalesWalkinPage() {
    const [selectedCategory, setSelectedCategory] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProductId, setSelectedProductId] = useState(null);
    const [selectedSizeUnit, setSelectedSizeUnit] = useState('');
    const [selectedProductSize, setSelectedProductSize] = useState('');


    
    const categories = UseFetchCategoriesHook();
    const {products, loading, error} = UseFetchProductsHook(selectedCategory);
    const {staff} = useContext(StaffContext);
    const {cartItems, setCartItems, handleAddToCartClick} = UseCartHook(staff);

    const handleSizeUnitChange = (e) => {
        setSelectedSizeUnit(e.target.value);
        setSelectedProductSize('');
    };
    

    const handleAddToCart = async (productId) => {
        const success = await handleAddToCartClick(staff?._id, productId, 1);
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
                        <span>Showing {products.length} results</span>
                    </div>
                </div>
               
                <div>
                    <select 
                    name="sizeUnit" 
                    id="sizeUnit"
                    value={selectedSizeUnit}
                    onChange={handleSizeUnitChange}
                    >
                        <option value="">All Size Unit</option>
                        {/* get unique sizeUnits from products */}
                        {
                        Array.from(new Set(products.map(product => product.sizeUnit)))
                            .map(sizeUnit => (
                                <option key={sizeUnit} value={sizeUnit}>
                                    {sizeUnit}
                                </option>
                            ))
                        }
                    </select>
                </div>

                {/* second select for productSize */}
                <div>
                    <select 
                    name="productSize" 
                    id="productSize"
                    value={selectedProductSize}
                    onChange={(e) => setSelectedProductSize(e.target.value)}
                    disabled={!selectedSizeUnit}
                    >
                        <option value="">Product Size</option>
                        
                        {
                            products
                            .filter(product => product.sizeUnit === selectedSizeUnit)
                            .map(filteredProduct => (
                                <option key={filteredProduct._id} value={filteredProduct.productSize}>
                                    {filteredProduct.productSize}
                                </option>
                            ))
                        }
                    </select>
                </div>
                {/* <div className='staff-shop-content-header-section-right'>
                    <span>Show</span>
                    <button>16</button>
                </div> */}

                
            </div>
            <StaffDirectOrdersWalkinContentComponent
            onAddToCart={handleAddToCart}
            cartItems={cartItems}
            setCartItems={setCartItems}
            staff={staff}
            selectedSizeUnit={selectedSizeUnit}
            selectedProductSize={selectedProductSize}
            categories={categories}
            selectedCategory={selectedCategory}
            />
        </div>
    </div>

    <StaffModalWalkinContentDetailsComponent
    isOpen={isModalOpen}
    onClose={handleCloseModal}
    cartItems={cartItems}
    setCartItems={setCartItems}
    staffId={staff?._id}
    />

        
    </>
  )
}

export default StaffQuickSalesWalkinPage