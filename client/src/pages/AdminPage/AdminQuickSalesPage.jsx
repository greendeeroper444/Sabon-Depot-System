import React, {useContext, useState } from 'react'
import '../../CSS/StaffCSS/StaffPayment.css';
import UseFetchCategoriesHook from '../../hooks/AdminHooks/UseFetchCategoriesHook';
import UseFetchProductsHook from '../../hooks/AdminHooks/UseFetchProductsHook';
import AdminDirectOrdersWalkinContentComponent from '../../components/AdminComponents/AdminPos/AdminDirectOrdersWalkinContentComponent';
import AdminDirectOrdersRefillContentComponent from '../../components/AdminComponents/AdminPos/AdminDirectOrdersRefillContentComponent';
import AdminModalWalkinContentDetailsComponent from '../../components/AdminComponents/AdminPos/modals/AdminModalWalkinContentDetailsComponent';
import UseCartHook from '../../hooks/AdminHooks/UseCartHook';
import { AdminContext } from '../../../contexts/AdminContexts/AdminAuthContext';
import AdminModalRefillingContentDetailsComponent from '../../components/AdminComponents/AdminPos/modals/AdminModalRefillingContentDetailsComponent';
import UseCartRefillHook from '../../hooks/AdminHooks/UseCartRefillHook';

function AdminQuickSalesPage() {
    const [selectedCategory, setSelectedCategory] = useState('');
    const [orderType, setOrderType] = useState('Walkin');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProductId, setSelectedProductId] = useState(null);
    const [selectedSizeUnit, setSelectedSizeUnit] = useState('');
    const [selectedProductSize, setSelectedProductSize] = useState('');


    
    const categories = UseFetchCategoriesHook();
    const {products, loading, error} = UseFetchProductsHook(selectedCategory);
    const {admin} = useContext(AdminContext);
    const {cartItems, setCartItems, handleAddToCartClick} = UseCartHook(admin);
    const {cartItemsRefill, setCartItemsRefill, handleAddToCartClickRefill} = UseCartRefillHook(admin);

    const handleSizeUnitChange = (e) => {
        setSelectedSizeUnit(e.target.value);
        setSelectedProductSize('');
    };
    

    const handleAddToCart = async (productId) => {
        const success = await handleAddToCartClick(admin?._id, productId, 1);
        if(success){
            setSelectedProductId(productId);
            setIsModalOpen(true);
        }
    };

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
                        <span>Showing {products.length} results</span>
                    </div>
                </div>
                {/* select of walkin or refilling */}
                <div>
                    <select
                    name="orderType"
                    id="orderType"
                    value={orderType}
                    onChange={(e) => setOrderType(e.target.value)}
                    >
                        <option value="Walkin">Walkin Order</option>
                        <option value="Refilling">Refilling</option>
                    </select>
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
                <div className='staff-shop-content-header-section-right'>
                    <span>Show</span>
                    <button>16</button>
                </div>

                
            </div>
            {
                orderType === 'Walkin' ? (
                    <AdminDirectOrdersWalkinContentComponent
                    onAddToCart={handleAddToCart}
                    cartItems={cartItems}
                    setCartItems={setCartItems}
                    admin={admin}
                    selectedSizeUnit={selectedSizeUnit}
                    selectedProductSize={selectedProductSize}
                    />
                ) : (
                    <AdminDirectOrdersRefillContentComponent
                    onAddToCart={handleAddToCartRefill}
                    cartItems={cartItemsRefill}
                    setCartItems={setCartItemsRefill}
                    admin={admin}
                    />
                )
            }
        </div>
    </div>
        {
            orderType === 'Walkin' ? (
                <AdminModalWalkinContentDetailsComponent
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    cartItems={cartItems}
                    setCartItems={setCartItems}
                    adminId={admin?._id}
                />
            ) : (
                <AdminModalRefillingContentDetailsComponent
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                cartItems={cartItemsRefill}
                setCartItems={setCartItemsRefill}
                adminId={admin?._id}
            />
            )
        }

        
    </>
  )
}

export default AdminQuickSalesPage