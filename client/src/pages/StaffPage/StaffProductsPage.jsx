import React, { useEffect, useState } from 'react'
import '../../CSS/StaffCSS/StaffProducts.css';
import editIcon from '../../assets/staff/stafficons/staff-orders-edit-icon.png';
import archiveIcon from '../../assets/staff/stafficons/staff-products-archive-icon.png';
import axios from 'axios';
import StaffModalProductsAddComponent from '../../components/StaffComponents/StaffModalProducts/StaffModalProductsAddComponent';
import StaffModalProductsEditComponent from '../../components/StaffComponents/StaffModalProducts/StaffModalProductsEditComponent';
import toast from 'react-hot-toast';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import StaffModalArchivedProductComponent from '../../components/StaffComponents/StaffModalProducts/StaffModalArchivedProductComponent';
import { orderDate } from '../../utils/OrderUtils';


function StaffProductsPage() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isArchivedModalOpen, setIsArchiveModalOpen] = useState(false);
    const [productIdToArchive, setProductIdToArchive] = useState(null);
    const [isArchived, setIsArchived] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedBatch, setSelectedBatch] = useState(null);
    const [batches, setBatches] = useState([]);

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
            const response = await axios.get('/staffProduct/getProductStaff');
    
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
            const response = await axios.get(`/staffProduct/getEditProductStaff/${productId}`);
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

    
    //archive function
    const handleConfirmArchive = async() => {
        try {
            const response = await axios.put(`/staffProduct/archiveProductStaff/${productIdToArchive}`);
            
            if(response.status === 200){
                toast.success(response.data.message);
                fetchProducts(); //fefresh the product list after archiving
                setIsArchiveModalOpen(false);
            }
        } catch (error) {
            console.error(error);
            toast.error('Failed to archive the product');
        }
    };
    
    const handleArchivedProductClick = (productId, archivedStatus) => {
        setProductIdToArchive(productId);
        setIsArchived(archivedStatus);
        setIsArchiveModalOpen(true);
    };
    const handleCloseArchiveModal = () => {
        setIsArchiveModalOpen(false);
        setProductIdToArchive(null);
    };

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

    //display/get product data
    // const fetchProducts = async() => {
    //     try {
    //         const response = await axios.get('/staffProduct/getProductStaff');
    //         setProducts(response.data);
    //         setLoading(false);
    //     } catch (error){
    //         setError(error);
    //         setLoading(false);
    //     }
    // };
    // const fetchProducts = async() => {
    //     try {
    //         const response = await axios.get('/staffProduct/getProductStaff');
            
    //         //sort products by quantity in ascending order
    //         const sortedProducts = response.data.sort((a, b) => a.quantity - b.quantity);
            
    //         setProducts(sortedProducts);
    //         setLoading(false);
    //     } catch (error) {
    //         setError(error);
    //         setLoading(false);
    //     }
    // };

    useEffect(() => {
        fetchProducts();
    }, []);

    

    const handleAddProductClick = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const currentDate = new Date().toLocaleDateString('en-SG', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        timeZone: 'Asia/Singapore',
    });

    
    if(loading){
        return <p>Loading...</p>;
    }

    
  return (
    <div className='staff-products-container'>

        <StaffModalProductsAddComponent 
        isOpen={isModalOpen} 
        onClose={handleCloseModal}
        fetchProducts={fetchProducts}
        />

        {/* <StaffModalProductsDeleteComponent
        isOpen={isDeleteModalOpen} 
        onClose={handleCloseDeleteModal} 
        onConfirm={handleConfirmDelete} 
        /> */}
        
        {/* archive */}
        <StaffModalArchivedProductComponent
        isOpen={isArchivedModalOpen} 
        onClose={handleCloseArchiveModal} 
        onConfirm={handleConfirmArchive} 
        isArchived={isArchived}
        />

        <StaffModalProductsEditComponent
        isOpen={isEditModalOpen} 
        onClose={handleCloseEditModal} 
        selectedProduct={selectedProduct}
        fetchProducts={fetchProducts}
        />

        <div className='staff-products-header'>
            <h1>CLEAN-UP SOLUTIONS ENTERPRISES, INC.</h1>
            <h2>PRODUCT LISTS</h2>
            <p>As of {currentDate}</p>
        </div>

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
        
        <div className='staff-products-controls'>
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
            <button onClick={handleGenerateReport}>Reports</button>
        </div>

        {error && <p>{error}</p>}
        
        {
            products.length === 0 ? (
                <p>No products available.</p>
            ) : (
                <table className='staff-products-table'>
                    <thead>
                        <tr>
                            <th>Product Code</th>
                            <th>Product Name</th>
                            <th>Category</th>
                            <th>Size</th>
                            <th>Price</th>
                            <th>Quantity</th>
                            <th>Availability</th>
                            <th>Expiration</th>
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
                                    <td>{product.productCode}</td>
                                    <td className='product-image-name'>
                                    {/* <img src={`${import.meta.env.VITE_BASE_URL}${product.imageUrl}`} alt={product.productName} />{' '}{product.productName} */}
                                        <img src={`${product.imageUrl}`} alt={product.productName} />{' '}{product.productName}
                                    </td>
                                    <td>{product.category}</td>
                                    <td>{product.sizeUnit.slice(0, 1)} - {product.productSize}</td>
                                    <td>{`₱${product.price.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`}</td>
                                    <td>{product.quantity}</td>
                                    <td className={product.quantity > 0 ? (product.quantity > product.stockLevel ? 'in-stock' : 'low-stock') : 'out-of-stock'}>
                                        {product.quantity > 0 ? (product.quantity > product.stockLevel ? 'In stock' : 'Low stock') : 'Out of stock'}
                                    </td>
                                    <td>{`${orderDate(product.expirationDate)}`}</td>
                                    <td className='actions-tbody'>
                                        <button className='button-edit-icon'
                                        onClick={() => handleEditProductClick(product._id)}
                                        >
                                            <img src={editIcon} alt="Edit Icon" />
                                            </button>
                                        <button className='button-archived-icon' 
                                        onClick={() => handleArchivedProductClick(product._id, product.isArchived)}>
                                            {
                                                product.isArchived ? (
                                                    <span>Unarchive</span>
                                                ) : (
                                                    <img src={archiveIcon} alt="Archive Icon" />
                                                )
                                            }
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

export default StaffProductsPage