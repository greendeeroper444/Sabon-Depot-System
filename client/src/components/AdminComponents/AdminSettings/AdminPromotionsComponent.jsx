import React, { useEffect, useState } from 'react'
import '../../../CSS/AdminCSS/AdminSettings/AdminPromitionsComponent.css';
import axios from 'axios';
import editIcon from '../../../assets/staff/stafficons/staff-orders-edit-icon.png';
import deleteIcon from '../../../assets/staff/stafficons/staff-orders-delete-icon.png';
import AdminModalProductsAddComponent from '../../../components/AdminComponents/AdminModalProducts/AdminModalProductsAddComponent';
import AdminModalProductsDeleteComponent from '../../../components/AdminComponents/AdminModalProducts/AdminModalProductsDeleteComponent';
import AdminModalProductsEditComponent from '../../../components/AdminComponents/AdminModalProducts/AdminModalProductsEditComponent';
import toast from 'react-hot-toast';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { orderDate } from '../../../utils/OrderUtils';


function AdminPromotionsComponent() {
    const [batches, setBatches] = useState([]);
    const [selectedBatch, setSelectedBatch] = useState(null);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [productIdToDelete, setProductIdToDelete] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [summaryData, setSummaryData] = useState({
        categoryCount: 0,
        totalProducts: 0,
        totalUnitsProduced: 0,
        totalValue: 0,
        lowStockCount: 0,
        notInStock: 0
    });
    const [selectedCategory, setSelectedCategory] = useState('');

    const categories = [...new Set(products.map((product) => product.category))];

    const handleCategoryChange = (event) => {
        setSelectedCategory(event.target.value);
    };

    const filteredProducts = selectedCategory
    ? products.filter((product) => product.category === selectedCategory)
    : products;

    //display/get product data
    const fetchProducts = async() => {
        try {
            const response = await axios.get('/adminProduct/getProductAdmin');
    
            //extract unique batch names from the response data
            const uniqueBatches = [...new Set(response.data.map((product) => product.batch))];
    
            setBatches(uniqueBatches);
    
            //sort products by quantity
            const sortedProducts = response.data.sort((a, b) => a.quantity - b.quantity);
            setProducts(sortedProducts);
            setLoading(false);
        } catch (error) {
            setError(error);
            setLoading(false);
        }
    };
    


    useEffect(() => {
        fetchProducts();
    }, []);

    //fetch products for a selected batch
    const fetchBatchProducts = async(batch) => {
        setLoading(true);
        try {
            const response = await axios.get(`/adminProduct/getBatchProductAdmin?batch=${batch}`);
            setProducts(response.data);
            setSelectedBatch(batch);
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        const fetchSummaryData = async() => {
            try {
                const response = await axios.get('/adminProduct/getProductSummaryAdmin');
                setSummaryData(response.data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchSummaryData();
    }, []);


    //generate PDF report
    const handleGenerateReport = () => {
        const doc = new jsPDF();
    
        //title
        doc.setFontSize(18);
        doc.setTextColor(34, 31, 197);
        doc.setFont(undefined, 'bold');
        doc.text('CLEAN-UP SOLUTIONS ENTERPRISES, INC.', 14, 16);
    
        //subtitle
        doc.setFontSize(14);
        doc.setTextColor(197, 31, 41);
        doc.setFont(undefined, 'bold');
        doc.text('PRICE MONITORING SHEET', 14, 24);
    
        //date
        const now = new Date();
        const formattedDate = new Intl.DateTimeFormat('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        }).format(now);
        const upperCaseDate = formattedDate.toUpperCase();
        doc.setFontSize(8);
        doc.setTextColor(0, 0, 0);
        doc.setFont(undefined, 'bold');
        doc.text(`AS OF ${upperCaseDate}`, 14, 32);
    
        //table
        doc.autoTable({
            startY: 40,
            head: [['Product Code', 'Product', 'Category', 'Price']],
            body: products.map(product => [
                product.productCode,
                product.productName,
                product.category,
                product.price.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})
            ]),
            styles: {fontSize: 12, halign: 'center'},
            headStyles: {fillColor: [0, 0, 139]},
        });
    
        //save the PDF
        doc.save('product_report.pdf');
    };

    //edit function
    const handleEditProductClick = async(productId) => {
        try {
            const response = await axios.get(`/adminProduct/getEditProductAdmin/${productId}`);
            setSelectedProduct(response.data);
            setIsEditModalOpen(true);
        } catch (error) {
            console.error(error);
        }
    };

    const handleCloseEditModal = () => {
        setIsEditModalOpen(false);
        setSelectedProduct(null);
    };

    

    
    const handleDeleteProductClick = (productId) => {
        setProductIdToDelete(productId);
        setIsDeleteModalOpen(true);
    };
    const handleAddProductClick = () => {
        setIsModalOpen(true);
    };


    
    if(loading){
        return <p>Loading...</p>;
    }

  return (
    <div className='admin-promotions-container'>

        <AdminModalProductsEditComponent
        isOpen={isEditModalOpen} 
        onClose={handleCloseEditModal} 
        selectedProduct={selectedProduct}
        fetchProducts={fetchProducts}
        />

        <div>
            {
                batches.length > 0 ? (
                    <>
                        {/* all Batch Button */}
                        <button
                        onClick={() => {
                            setSelectedBatch(null);
                            fetchProducts();
                        }}
                        style={{
                            margin: '0 10px',
                            padding: '10px 20px',
                            backgroundColor: selectedBatch === null ? 'green' : 'lightgray',
                            color: 'white',
                            border: 'none',
                            cursor: 'pointer',
                        }}
                        >
                            All Batch
                        </button>
                        
                        <br />
                        <br />
                        {/*individual Batch Buttons */}
                        {
                            batches.map((batch) => (
                                <button
                                    key={batch}
                                    onClick={() => fetchBatchProducts(batch)}
                                    style={{
                                        margin: '0 10px',
                                        padding: '10px 20px',
                                        backgroundColor: selectedBatch === batch ? 'green' : 'lightgray',
                                        color: 'white',
                                        border: 'none',
                                        cursor: 'pointer',
                                    }}
                                >
                                    {batch}
                                </button>
                            ))
                        }
                    </>
                ) : (
                    <p>Loading batches...</p>
                )
            }
        </div>

        <div className='admin-promotions-controls'>
            <div>Products</div>
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
            </div>
        </div>

        <br />

        {error && <p>{error}</p>}

        {
            products.length === 0 ? (
                <p>No products available.</p>
            ) : (
                <table className='admin-promotions-table'>
                    <thead>
                        <tr>
                            <th>Product Name</th>
                            <th>Category</th>
                            <th>Size</th>
                            <th>Price</th>
                            <th>Expiration</th>
                            <th>Discount (%)</th>
                            <th>Discounted Price</th>
                            <th>Discount End</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            filteredProducts.map((product) => (
                                <tr 
                                key={product._id} 
                                className={`${product.isArchived ? 'archived-product' : ''} 
                                ${product.quantity < product.stockLevel ? 'low-quantity' : ''} 
                                ${product.quantity === 0 ? 'out-of-quantity' : ''}
                                ${product.isArchived && product.quantity < product.stockLevel ? 'low-quantity archived-product' : ''}`}
                                >
                                    <td className='product-image-name'>
                                        <img src={`${import.meta.env.VITE_BASE_URL}${product.imageUrl}`} alt={product.productName} />{' '}{product.productName}
                                    </td>
                                    <td>{product.category}</td>
                                    <td>{product.sizeUnit.slice(0, 1)} - {product.productSize}</td>
                                    <td>{product.price}</td>
                                    <td>{`${orderDate(product.expirationDate)}`}</td>
                                    <td>{product.discountPercentage ? `${product.discountPercentage}%` : 'No Discount'}</td>
                                    <td>{product.discountedPrice}</td>
                                    <td>{product.discountedDate ? `${orderDate(product.discountedDate)}` : 'No Discount Date'}</td>
                                    <td className='actions-tbody'>
                                        <button className='button-edit-icon'
                                        onClick={() => handleEditProductClick(product._id)}
                                        >
                                        <img src={editIcon} alt="Edit Icon" />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            )
        }
    </div>
  )
}

export default AdminPromotionsComponent