// import React from 'react'
// import '../../../CSS/AdminCSS/AdminInventory/RefillProduct.css';

// const products = [
//   { id: 1, productName: 'Product 1', quantiy: 50, maximumSizeLiter: 105, color: 'orange' }, // Full
//   { id: 2, productName: 'Product 2', quantiy: 50, maximumSizeLiter: 105, color: 'yellow' },  // Half full
//   { id: 3, productName: 'Product 3', quantiy: 75, maximumSizeLiter: 105, color: 'green' },  // 75% full
//   { id: 4, productName: 'Product 4', quantiy: 30, maximumSizeLiter: 105, color: 'blue' },  // Less water
// ];

// function StaffRefillProductPage() {
//   return (
//     <div className='admin-refill-container'>
//       <div className='controls'>
//         <select className='dropdown'>
//           <option>All Products</option>
//         </select>
//         <select className='dropdown'>
//           <option>Refill</option>
//         </select>
//         <button className='deducted-btn'>Deducted</button>
//       </div>

//       <div className='product-grid'>
//         {products.map((product) => {
//           const waterLevel = (product.quantiy / product.maxquantiy) * 100;

//           return (
//             <div className='product-display' key={product.id}>
//               <div className='cylinder'>
//                 <div
//                   className='water'
//                   style={{ height: `${waterLevel}%`, background: product.color }}
//                 ></div>
//               </div>
//               <p>
//                 {product.productName} - {product.quantiy}L
//               </p>
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// }

// export default StaffRefillProductPage;


import React, { useEffect, useState } from 'react'
import '../../CSS/AdminCSS/AdminInventory/RefillProduct.css';
import StaffModalRefillProductsAddComponent from '../../components/StaffComponents/StaffModalRefillProducts/StaffModalRefillProductsAddComponent';
import StaffModalRefillProductsDeleteComponent from '../../components/StaffComponents/StaffModalRefillProducts/StaffModalRefillProductsDeleteComponent';
import StaffModalRefillProductsEditComponent from '../../components/StaffComponents/StaffModalRefillProducts/StaffModalRefillProductsEditComponent';
import 'jspdf-autotable';
import axios from 'axios';
import toast from 'react-hot-toast';

function StaffRefillProductPage() {
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [refillProducts, setRefillProducts] = useState([]); 
    const [productIdToDelete, setProductIdToDelete] = useState(null);

    const [selectedCategory, setSelectedCategory] = useState('');
    const categories = [...new Set(refillProducts.map((product) => product.category))];

    const handleCategoryChange = (event) => {
        setSelectedCategory(event.target.value);
    };

    const filteredRefillProducts = selectedCategory
    ? refillProducts.filter((product) => product.category === selectedCategory)
    : refillProducts;

    useEffect(() => {
        fetchRefillProducts();
    }, []);

    const fetchRefillProducts = async () => {
        try {
            const response = await axios.get('/staffRefillProduct/getRefillProductStaff');
            setRefillProducts(response.data);
        } catch (error) {
            console.error('Error fetching refill products:', error);
            setError('Failed to load products');
        }
    };
    const handleAddProductClick = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleCloseEditModal = () => {
        setIsEditModalOpen(false);
        setSelectedProduct(null);
    };

    const handleEditProductClick = async(productId) => {
        try {
            const response = await axios.get(`/staffRefillProduct/getEditRefillProductStaff/${productId}`);
            setSelectedProduct(response.data);
            setIsEditModalOpen(true);
        } catch (error) {
            console.error(error);
        }
    };

    const handleDeleteProductClick = (productId) => {
        setProductIdToDelete(productId);
        setIsDeleteModalOpen(true);
    };
    const handleCloseDeleteModal = () => {
        setIsDeleteModalOpen(false);
        setProductIdToDelete(null);
    };
    
    //delete function
    const handleConfirmDelete = async() => {
        try {
            const response = await axios.delete(`/staffRefillProduct/deleteRefillProductStaff/${productIdToDelete}`);
            setRefillProducts(refillProducts.filter(product => product._id !== productIdToDelete));
            setIsDeleteModalOpen(false);
            setProductIdToDelete(null);
            toast.success(response.data.message);
        } catch (error) {
            console.log(error)
        }
    };
  return (
    <div className='admin-finished-product-container'>
        <StaffModalRefillProductsAddComponent
        isOpen={isModalOpen} 
        onClose={handleCloseModal}
        fetchRefillProducts={fetchRefillProducts}
        />

        <StaffModalRefillProductsDeleteComponent
        isOpen={isDeleteModalOpen} 
        onClose={handleCloseDeleteModal} 
        onConfirm={handleConfirmDelete} 
        />

        <StaffModalRefillProductsEditComponent
        isOpen={isEditModalOpen} 
        selectedProduct={selectedProduct}
        onClose={handleCloseEditModal}
        fetchRefillProducts={fetchRefillProducts}
        />

        <div className='admin-finished-product-header'>
            <div className='admin-finished-product-header-controls'>
                <div>Overall Inventory</div>
            </div>
            <div className='admin-finished-product-container'>
                <table className='admin-finished-product-header-table'>
                    <thead>
                        <tr>
                            <th>Categories</th>
                            <th>Total Products</th>
                            <th>Total Units Produced</th>
                            <th></th>
                            <th>Low Stocks</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className='subtext'>
                            {/* <td>Last 7 days</td>
                            <td>Last 7 days</td>
                            <td>Last 7 days</td> */}
                            <td>Total</td>
                            <td>Ordered</td>
                            <td>Not in stock</td>
                        </tr>
                    </tbody>
                </table>
            </div>

        </div>


        <div className='admin-finished-product-controls'>
            <div>Refill Products</div>
            <div>
                <select onChange={handleCategoryChange} value={selectedCategory}>
                    <option value=''>All Categories</option>
                    {
                        categories.map((category, index) => (
                            <option key={index} value={category}>
                                {category}
                            </option>
                        ))
                    }
                </select>
               
                <button onClick={handleAddProductClick}>Add Product</button>
            </div>
        </div>

        {error && <p>{error}</p>}
        <br />
        <br />
        <br />
        <table className='product-table'>
            <thead>
                <tr>
                    <th>Product Name</th>
                    <th>Liquid Level</th>
                    <th>Volume (L)</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {
                    filteredRefillProducts.map((product) => {
                        const waterLevel = (product.volume / product.maximumSizeLiter) * 100;
                        
                        return (
                            <tr key={product._id}>
                                <td>{product.productName}</td>
                                <td>
                                    <div className='cylinder'>
                                        <div
                                            className='water'
                                            style={{ height: `${waterLevel}%`, background: product.color }}
                                        ></div>
                                    </div>
                                </td>
                                <td>{product.volume}L</td>
                                <td>
                                    <button onClick={() => handleEditProductClick(product._id)}>Edit</button>
                                    {' '}
                                    <button onClick={() => handleDeleteProductClick(product._id)}>Delete</button>
                                </td>
                            </tr>
                        );
                    })
                }
            </tbody>
        </table>

    </div>
  )
}

export default StaffRefillProductPage