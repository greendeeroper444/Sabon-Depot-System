import React, { useState, useEffect } from 'react'
import axios from 'axios';
import '../../../CSS/AdminCSS/AdminSettings/AdminInventoryComponent.css';

function AdminInventoryComponent() {
    const [selectedSize, setSelectedSize] = useState('All');
    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
    const [categories, setCategories] = useState([]);
    const [categoryName, setCategoryName] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [editCategoryId, setEditCategoryId] = useState(null);
    const [isSizeModalOpen, setIsSizeModalOpen] = useState(false);
    const [sizes, setSizes] = useState([]);
    const [sizeUnit, setSizeUnit] = useState('Milliliters');
    const [productSize, setProductSize] = useState('');
    const [editSizeId, setEditSizeId] = useState(null);

    useEffect(() => {
        fetchCategories();
        fetchSizes();
    }, []);

    const fetchSizes = async() => {
        try {
            const response = await axios.get('/adminProductSize/getProductSize');
            setSizes(response.data);
        } catch (error) {
            console.error('Error fetching sizes', error);
        }
    };


    const fetchCategories = async() => {
        try {
            const response = await axios.get('/adminProductCategory/getProductCategory');
            setCategories(response.data);
        } catch (error) {
            console.error('Error fetching categories', error);
        }
    };

    const handleSizeSubmit = async () => {
        try {
            if(isEditing){
                //when editing, update the product size with correct field names
                await axios.put(`/adminProductSize/updateProductSize/${editSizeId}`, {productSize, sizeUnit});
                setIsEditing(false);
            } else{
                //when adding a new size, use the correct field names
                await axios.post('/adminProductSize/addProductSize', {productSize, sizeUnit});
            }
            setProductSize('');
            setSizeUnit('Milliliters');
            setIsSizeModalOpen(false);
            fetchSizes();
        } catch (error) {
            console.error(error);
        }
    };
    

    const handleCategorySubmit = async() => {
        try {
            if(isEditing){
                await axios.put(`/adminProductCategory/updateProductCategory/${editCategoryId}`, { categoryName });
                setIsEditing(false);
            } else{
                await axios.post('/adminProductCategory/addProductCategory', { categoryName });
            }
            setCategoryName('');
            setIsCategoryModalOpen(false);
            fetchCategories();
        } catch (error) {
            console.error('Error adding/updating category', error);
        }
    };

    const handleEditSize = (sizeId, productSize, sizeUnit) => {
        setEditSizeId(sizeId);
        setProductSize(productSize);
        setSizeUnit(sizeUnit);
        setIsEditing(true);
        setIsSizeModalOpen(true);
    };
    const handleEditCategory = (categoryId, categoryName) => {
        setEditCategoryId(categoryId);
        setCategoryName(categoryName);
        setIsEditing(true);
        setIsCategoryModalOpen(true);
    };

    const handleDeleteSize = async(sizeId) => {
        try {
            await axios.delete(`/adminProductSize/deleteProductSize/${sizeId}`);
            fetchSizes();
        } catch (error) {
            console.error(error);
        }
    };

    const handleDeleteCategory = async(categoryId) => {
        try {
            await axios.delete(`/adminProductCategory/deleteProductCategory/${categoryId}`);
            fetchCategories();
        } catch (error) {
            console.error(error);
        }
    };

    const handleFilterClick = (sizeUnit) => {
        setSelectedSize(sizeUnit);
    };

    const filteredSizes = selectedSize === 'All' ? sizes : sizes.filter(size => size.sizeUnit === selectedSize);

  return (
    <div className='admin-inventory-container'>
        {/* product Category Section */}
        <div className='category-section'>
            <h2>Product Categories</h2>
            <button onClick={() => setIsCategoryModalOpen(true)} className='add-category-btn'>
                Add Category
            </button>
            <table className='inventory-table'>
                <thead>
                    <tr>
                        {/* <th>Category ID</th> */}
                        <th>Category Name</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        categories.map((category) => (
                            <tr key={category._id}>
                                {/* <td>{category._id}</td> */}
                                <td>{category.categoryName}</td>
                                <td>
                                    <button onClick={() => handleEditCategory(category._id, category.categoryName)} className='edit-btn'>
                                        Edit
                                    </button>
                                    <button onClick={() => handleDeleteCategory(category._id)} className='delete-btn'>
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>
        </div>

        {/* add/Update Category Modal */}
        {
            isCategoryModalOpen && (
                <div className='modal-overlay'>
                    <div className='modal-content'>
                        <h2>{isEditing ? 'Edit Category' : 'Add Category'}</h2>
                        <div className='modal-body'>
                            <label>
                                Category Name:
                                <input
                                type='text'
                                value={categoryName}
                                onChange={(e) => setCategoryName(e.target.value)}
                                className='category-input'
                                />
                            </label>
                        </div>
                        <div className='modal-footer'>
                            <button onClick={handleCategorySubmit} className='submit-button'>
                                {isEditing ? 'Update' : 'Submit'}
                            </button>
                            <button onClick={() => setIsCategoryModalOpen(false)} className='close-button'>
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )
        }

        <div className='size-section'>
            <h2>Product Sizes</h2>
            <div className='product-size-buttons'>
                <div className='filter-buttons'>
                    <button
                    onClick={() => handleFilterClick('All')}
                    className={`filter-btn ${selectedSize === 'All' ? 'active' : ''}`}
                    >
                        All
                    </button>
                    <button
                    onClick={() => handleFilterClick('Milliliters')}
                    className={`filter-btn ${selectedSize === 'Milliliters' ? 'active' : ''}`}
                    >
                        Milliliters
                    </button>
                    <button
                    onClick={() => handleFilterClick('Liters')}
                    className={`filter-btn ${selectedSize === 'Liters' ? 'active' : ''}`}
                    >
                        Liters
                    </button>
                    <button
                    onClick={() => handleFilterClick('Gallons')}
                    className={`filter-btn ${selectedSize === 'Gallons' ? 'active' : ''}`}
                    >
                        Gallons
                    </button>
                    <button
                    onClick={() => handleFilterClick('Drums')}
                    className={`filter-btn ${selectedSize === 'Drums' ? 'active' : ''}`}
                    >
                        Drums
                    </button>
                </div>
                <button onClick={() => setIsSizeModalOpen(true)} className='add-size-btn'>
                    Add Size
                </button>
            </div>
            <table className='inventory-table'>
                <thead>
                    <tr>
                        {/* <th>Size ID</th> */}
                        <th>Size Name</th>
                        <th>Size Unit</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        filteredSizes.map((size) => (
                            <tr key={size._id}>
                                {/* <td>{size._id}</td> */}
                                <td>{size.productSize}</td>
                                <td>{size.sizeUnit}</td>
                                <td>
                                    <button onClick={() => handleEditSize(size._id, size.productSize, size.sizeUnit)} className='edit-btn'>
                                        Edit
                                    </button>
                                    <button onClick={() => handleDeleteSize(size._id)} className='delete-btn'>
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>
        </div>

        {/* add/Update Size Modal */}
        {
            isSizeModalOpen && (
                <div className='modal-overlay'>
                    <div className='modal-content'>
                        <h2>{isEditing ? 'Edit Size' : 'Add Size'}</h2>
                        <div className='modal-body'>
                            <label>
                                Size Unit:
                                <select
                                    value={sizeUnit}
                                    onChange={(e) => setSizeUnit(e.target.value)}
                                    className='category-input'
                                >
                                    <option value='Milliliters'>Milliliters</option>
                                    <option value='Liters'>Liters</option>
                                    <option value='Gallons'>Gallons</option>
                                    <option value='Drums'>Drums</option>
                                </select>
                            </label>
                            <label>
                                Product Size:
                                <input
                                type='text'
                                value={productSize}
                                onChange={(e) => {
                                    const input = e.target.value.replace(/[^\d]/g, '');
                                    if (input) {
                                        setProductSize(`${input}${sizeUnit === 'Milliliters' ? 'ml' : sizeUnit === 'Liters' ? 'L' : sizeUnit === 'Gallons' ? 'gal' : 'drum'}`);
                                    } else {
                                        setProductSize('');
                                    }
                                }}
                                className='category-input'
                                />
                            </label>
                        </div>
                        <div className='modal-footer'>
                            <button onClick={handleSizeSubmit} className='submit-button'>
                                {isEditing ? 'Update' : 'Submit'}
                            </button>
                            <button onClick={() => setIsSizeModalOpen(false)} className='close-button'>
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )
        }
    </div>
  )
}

export default AdminInventoryComponent
