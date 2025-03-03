import React, { useEffect, useState } from 'react'
import '../../../CSS/StaffCSS/StaffModalProducts/StaffModalProductsEdit.css';
import uploadIcon from '../../../assets/staff/stafficons/staff-prices-upload-icon.png';
import toast from 'react-hot-toast';
import axios from 'axios';

function StaffModalProductsEditComponent({isOpen, onClose, selectedProduct, fetchProducts}) {
    const [selectedImage, setSelectedImage] = useState(null);
    const [dataInput, setDataInput] = useState({
        productCode: '',
        productName: '',
        category: '',
        price: '',
        quantity: '',
        stockLevel: '', 
        discountPercentage: '',
        discountedDate: '',
        productSize: '',
        sizeUnit: '',
        expirationDate: '',
        updatedAt: '',
        description: '',
    });
    const [inputValue, setInputValue] = useState(''); 
    const [categories, setCategories] = useState([]);
    const [sizeUnits, setSizeUnits] = useState([]);


    useEffect(() => {
        const fetchSizeUnits = async() => {
            try {
                const response = await axios.get('/adminProductSize/getSizeUnitsWithSizes');
                setSizeUnits(response.data);
                console.log('Size Units fetched',response.data);
            } catch (error) {
                console.error(error);
                setSizeUnits([]); //jandle errors gracefully
            }
        };
    
        fetchSizeUnits();
    }, []);

    useEffect(() => {
        const fetchCategories = async() => {
            try {
                const response = await axios.get('/adminProductCategory/getProductCategory');
                console.log('Fetched Categories:', response.data);
                if(Array.isArray(response.data)){
                    setCategories(response.data); //ensure categories are set correctly
                } else{
                    setCategories([]); //if not an array, set it as an empty array
                }
            } catch (error) {
                console.error('Error fetching categories:', error);
                setCategories([]); //set empty array if there's an error
            }
        };
    
        fetchCategories();
    }, []);
    

    //handle category selection change
    const handleCategoryChange = (event) => {
        const selectedValue = event.target.value;
        setDataInput((prevState) => ({
            ...prevState,
            category: selectedValue,
        }));
    };
    

    const handleEditProductStaff = async(e) => {
        e.preventDefault();

        const updatedQuantity = 
        (!isNaN(parseInt(dataInput.quantity)) ? parseInt(dataInput.quantity) : 0) +
        (!isNaN(parseInt(inputValue)) ? parseInt(inputValue) : 0);

        const formData = new FormData();
        formData.append('productCode', dataInput.productCode);
        formData.append('productName', dataInput.productName);
        formData.append('category', dataInput.category);
        formData.append('price', dataInput.price);
        formData.append('quantity', updatedQuantity);
        formData.append('stockLevel', dataInput.stockLevel);
        formData.append('discountPercentage', dataInput.discountPercentage);
        formData.append('discountedDate', dataInput.discountedDate);
        formData.append('productSize', dataInput.productSize);
        formData.append('sizeUnit', dataInput.sizeUnit);
        formData.append('expirationDate', dataInput.expirationDate);
        formData.append('updatedAt', dataInput.updatedAt);
        formData.append('description', dataInput.description);
        if(selectedImage && typeof selectedImage !== 'string'){
            formData.append('image', selectedImage);
        }

        try {
            const response = await axios.put(`/staffProduct/editProductStaff/${selectedProduct._id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            toast.success(response.data.message);
            onClose();
            fetchProducts();
        } catch (error) {
            console.error(error);
        }
    };
    

    useEffect(() => {
        if(selectedProduct){
            const {productCode, productName, category, price, quantity, stockLevel, imageUrl, discountPercentage, discountedDate, productSize, sizeUnit, expirationDate, updatedAt, description} = selectedProduct;
            setDataInput({
                productCode: productCode || '',
                productName: productName || '',
                category: category || '',
                price: price || '',
                quantity: quantity || 0,
                stockLevel: stockLevel || '',
                discountPercentage: discountPercentage || '',
                discountedDate: discountedDate ? new Date(discountedDate).toISOString().split('T')[0] : '',
                productSize: productSize || '',
                sizeUnit: sizeUnit || '',
                expirationDate: expirationDate ? new Date(expirationDate).toISOString().split('T')[0] : '',
                updatedAt: updatedAt ? new Date(updatedAt).toISOString().split('T')[0] : '',
                description: description || '',
            });
            setSelectedImage(imageUrl || null);
        }
    }, [selectedProduct]);

    const handleFileInputClick = () => {
        document.getElementById('file-input').click();
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if(file){
            setSelectedImage(file);
        }
    };

    const handleSizeUnitChange = (e) => {
        setDataInput({
            ...dataInput,
            sizeUnit: e.target.value,
            productSize: '', //reset product size when unit changes
        });
    };

    const renderSizeInputOptions = () => {
        const selectedUnit = sizeUnits.find(unit => unit.sizeUnit === dataInput.sizeUnit);
    
        if(!selectedUnit) return null;
    
        return (
            <select
            value={dataInput.productSize}
            onChange={(e) => setDataInput({ ...dataInput, productSize: e.target.value })}
            >
                <option value="">Select size</option>
                {
                    selectedUnit.sizes.map((size, index) => (
                        <option key={index} value={size}>
                            {size}
                        </option>
                    ))
                }
            </select>
        );
    };

    if(!isOpen) return null;

  return (
    <div className='staff-modal-products-edit-container'>
        <form className='staff-modal-products-edit-content'>
            <div className='staff-modal-products-edit-image-upload'>
                <div className='staff-modal-products-edit-image-upload-left'>
                    <label htmlFor="file-input">
                        <img
                        src={selectedImage ? (typeof selectedImage === 'string' 
                            ? `${selectedImage}` 
                            : URL.createObjectURL(selectedImage)) 
                            : uploadIcon}
                        alt="upload placeholder"
                        className='upload-placeholder'
                        onError={(e) => {e.target.onerror = null; e.target.src = uploadIcon; }}
                        />
                    </label>
                </div>
                <div className='staff-modal-products-edit-image-upload-right'>
                    <span className='upload-instructions'>Please upload square image, size less than 100KB</span>
                    <div className='file-input-container'>
                        <input
                        id='file-input'
                        type="file"
                        accept='image/png, image/jpeg, image/jpg'
                        onChange={handleFileChange}
                        />
                        <span className='file-input-label' onClick={handleFileInputClick}>Choose File</span>
                        <span className='file-input-text'>{selectedImage ? 'File Chosen' : 'No File Chosen'}</span>
                    </div>
                </div>
            </div>
            <div className='staff-modal-products-edit-inputs'>
                <div className='label-text'>
                    <div>
                        <label>PRODUCT CODE:</label>
                        <input type="text"
                        value={dataInput.productCode}
                        onChange={(e) => setDataInput({...dataInput, productCode: e.target.value})}
                        />
                    </div>
                </div>
                <div className='label-text'>
                    <div>
                        <label>PRODUCT NAME:</label>
                        <input type="text"
                        value={dataInput.productName}
                        onChange={(e) => setDataInput({...dataInput, productName: e.target.value})}
                        />
                    </div>
                </div>
                <div className='label-text'>
                   
                    <div>
                        <label>CATEGORY:</label>
                        <select
                        value={dataInput.category}
                        onChange={handleCategoryChange}
                        >
                            <option value="">Select Category</option>
                            {
                                categories && categories.length > 0 ? (
                                    categories.map((category) => (
                                        <option key={category._id} value={category.categoryName}>
                                            {category.categoryName}
                                        </option>
                                    ))
                                ) : (
                                    <option value="">No categories available</option>
                                )
                            }
                        </select>
                    </div>
                </div>
                <div className='label-text'>
                    <div>
                        <label>SIZE UNIT:</label>
                        <select
                        value={dataInput.sizeUnit}
                        onChange={handleSizeUnitChange}
                        >
                            <option value="">Select size unit</option>
                            {
                                sizeUnits.map((unit, index) => (
                                    <option key={index} value={unit.sizeUnit}>
                                        {unit.sizeUnit}
                                    </option>
                                ))
                            }
                        </select>
                    </div>
                </div>
            </div>
<<<<<<< HEAD


            <div className='staff-modal-products-edit-inputs'>
                {
                    dataInput.sizeUnit && (
                        <div className='label-text'>
                            <div>
                                <label>PRODUCT SIZE:</label>
                                {renderSizeInputOptions()}
                            </div>
                        </div>
                    )
                }
                <div className='label-text'>
                    <div>
                        <label>PRICE:</label>
                        <input type="number"
                        value={dataInput.price}
                        onChange={(e) => setDataInput({...dataInput, price: e.target.value})}
                        />
                    </div>
                </div>
                <div className='label-text'>
                    <div>
                        <label>UPDATE QUANTITY:</label>
                        <input
=======
            <div className='label-text'>
                <label>UPDATE QUANTITY:</label>
                <div>
                    {/* <input
>>>>>>> 51d4e74b489c6897a48c84e6cb0fde24353eb508
                        type="number"
                        value={inputValue}
                        onChange={(e) => {
                            const newValue = e.target.value;
                            if(newValue === ''){
                                setInputValue('');
                            } else{
                                setInputValue(newValue);
                            }
                        }}
<<<<<<< HEAD
                        />
                    </div>
                    {/* <span>
                        = {dataInput.quantity + inputValue}
                    </span> */}
                    <span>
                        = {dataInput.quantity + (inputValue ? Number(inputValue) : 0)}
                    </span>

                </div>
                <div className='label-text'>
                    <div>
                        <label>UPDATE STOCK LEVEL:</label>
                        <input type="number"
                        value={dataInput.stockLevel} 
                        onChange={(e) => setDataInput({...dataInput, stockLevel: e.target.value})}
                        />
                    </div>
=======
                    /> */}
                    <input
                    type="number"
                    value={inputValue}
                    onChange={(e) => {
                        const newValue = e.target.value;
                        if(newValue === ''){
                            setInputValue('');
                        } else{
                            setInputValue(newValue);
                        }
                    }}
                    />
                </div>
                {/* <span>
                    = {dataInput.quantity + inputValue}
                </span> */}
                <span>
                    = {dataInput.quantity + (inputValue ? Number(inputValue) : 0)}
                </span>

            </div>
            <div className='label-text'>
                <label>UPDATE STOCK LEVEL:</label>
                <div>
                    <input type="number"
                    value={dataInput.stockLevel} 
                    onChange={(e) => setDataInput({...dataInput, stockLevel: e.target.value})}
                    />
>>>>>>> 51d4e74b489c6897a48c84e6cb0fde24353eb508
                </div>
            </div>

           <div className='staff-modal-products-edit-inputs'>
            <div className='label-text'>
                    <div>
                        <label>DISCOUNT PERCENTAGE:</label>
                        <input
                            type="number"
                            value={dataInput.discountPercentage}
                            onChange={(e) => setDataInput({...dataInput, discountPercentage: e.target.value})}
                        />
                    </div>
                </div>
                <div className='label-text'>
                    <div>
                        <label>DISCOUNT END:</label>
                        <input
                        type="date"
                        value={dataInput.discountedDate}
                        onChange={(e) => setDataInput({...dataInput, discountedDate: e.target.value})}
                        />
                    </div>
                </div>
                <div className='label-text'>
                    <div>
                        <label>EXPIRATION DATE:</label>
                        <input
                        type="date"
                        value={dataInput.expirationDate}
                        onChange={(e) => setDataInput({...dataInput, expirationDate: e.target.value})}
                        />
                    </div>
                </div>
                <div className='label-text'>
                    <div>
                        <label>UPLOADED DATE:</label>
                        <input
                        type="date"
                        value={dataInput.updatedAt}
                        onChange={(e) => setDataInput({...dataInput, updatedAt: e.target.value})}
                        />
                    </div>
                </div>
           </div>
            <div className='label-text'>
                
                <div>
                    <label>DESCRIPTION:</label>
                    <textarea
                        value={dataInput.description} 
                        onChange={(e) => setDataInput({...dataInput, description: e.target.value})}
                    />
                </div>
            </div>

            <div className='staff-modal-products-edit-buttons'>
                <button onClick={handleEditProductStaff}>SAVE</button>
                <button onClick={onClose}>CANCEL</button>
            </div>
        </form>
    </div>
  )
}

export default StaffModalProductsEditComponent
