import React, { useEffect, useState } from 'react'
import '../../../CSS/StaffCSS/StaffModalProducts/StaffModalProductsAdd.css';
import uploadIcon from '../../../assets/staff/stafficons/staff-prices-upload-icon.png'
import toast from 'react-hot-toast';
import axios from 'axios';

function StaffModalProductsAddComponent({isOpen, onClose, fetchProducts}) {
    const [selectedImage, setSelectedImage] = useState(null);
    const [categories, setCategories] = useState([]);
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
        description: '',
        refillPrice: ''
    })
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
                console.error(error);
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
    


    const handleFileInputClick = () => {
        document.getElementById('file-input').click();
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if(file){
            setSelectedImage(file);
        }
    };

    if(!isOpen) return null;

    const handleUploadProductStaff = async(e) => {
        e.preventDefault();
        const {productCode, productName, category, price, quantity, stockLevel, discountPercentage, discountedDate, productSize, sizeUnit, expirationDate, description, refillPrice} = dataInput;

        if(!productCode || !productName || !category || !price || !quantity || !stockLevel || !productSize || !sizeUnit || !expirationDate){
            toast.error('Please input all fields');
            return;
        }
        

        const formData = new FormData();
        formData.append('productCode', productCode);
        formData.append('productName', productName);
        formData.append('category', category);
        formData.append('price', price);
        formData.append('quantity', quantity);
        formData.append('stockLevel', stockLevel);
        formData.append('discountPercentage', discountPercentage);
        formData.append('discountedDate', discountedDate);
        formData.append('image', selectedImage);
        formData.append('productSize', productSize);
        formData.append('sizeUnit', sizeUnit);
        formData.append('expirationDate', expirationDate);
        formData.append('description', description);
        formData.append('refillPrice', refillPrice)

        try {
            const response = await axios.post('/staffProduct/uploadProductStaff', formData, {
                headers: { 
                    'Content-Type': 'multipart/form-data' 
                }
            });
            
            if(response.data.error){
                toast.error(response.data.error)
            } else{
                setDataInput({ 
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
                    description: '',
                    refillPrice: ''
                })
                toast.success(response.data.message);
                onClose();
                fetchProducts();//toupdate the table in the prices page
            }
        } catch (error) {
            console.log(error)
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
    
    

  return (
    <div className='staff-modal-products-add-container'>
        <form className='staff-modal-products-add-content'>
            <div className='staff-modal-products-add-image-upload'>
                <div className='staff-modal-products-add-image-upload-left'>
                    <label htmlFor="file-input">
                        <img 
                        src={selectedImage ? URL.createObjectURL(selectedImage) : uploadIcon} 
                        alt="upload placeholder" 
                        className='upload-placeholder' 
                        />
                    </label>
                </div>
                <div className='staff-modal-products-add-image-upload-right'>
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
            <div className='label-text'>
                <label>PRODUCT CODE :</label>
                <div>
                    <input type="text" 
                    value={dataInput.productCode} 
                    onChange={(e) => setDataInput({...dataInput, productCode: e.target.value})}
                    />
                </div>
            </div>
            <div className='label-text'>
                <label>PRODUCT NAME:</label>
                <div>
                    <input type="text"
                    value={dataInput.productName} 
                    onChange={(e) => setDataInput({...dataInput, productName: e.target.value})}
                    />
                </div>
            </div>
            <div className='label-text'>
                <label>PRODUCT CATEGORY:</label>
                <div>
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
                <label>SIZE UNIT:</label>
                <div>
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
            {
                dataInput.sizeUnit && (
                    <div className='label-text'>
                        <label>PRODUCT SIZE:</label>
                        <div>
                            {renderSizeInputOptions()}
                        </div>
                    </div>
                )
            }
            <div className='label-text'>
                <label>PRICE:</label>
                <div>
                    <input type="number"
                    value={dataInput.price} 
                    onChange={(e) => setDataInput({...dataInput, price: e.target.value})} 
                    />
                </div>
            </div>
            <div className='label-text'>
                <label>QUANTITY:</label>
                <div>
                    <input type="number"
                    value={dataInput.quantity} 
                    onChange={(e) => setDataInput({...dataInput, quantity: e.target.value})}
                    />
                </div>
            </div>
            <div className='label-text'>
                <label>STOCK LEVEL:</label>
                <div>
                    <input type="number"
                    value={dataInput.stockLevel} 
                    onChange={(e) => setDataInput({...dataInput, stockLevel: e.target.value})}
                    />
                </div>
            </div>
            <div className='label-text'>
                <label>DISCOUNT PERCENTAGE:</label>
                <div>
                    <input
                    type="number"
                    value={dataInput.discountPercentage}
                    onChange={(e) => setDataInput({...dataInput, discountPercentage: e.target.value})}
                    />
                </div>
            </div>
            <div className='label-text'>
                <label>DISCOUNT END:</label>
                <div>
                    <input
                    type="date"
                    value={dataInput.discountedDate}
                    onChange={(e) => setDataInput({...dataInput, discountedDate: e.target.value})}
                    />
                </div>
            </div>
            <div className='label-text'>
                <label>EXPIRATION DATE:</label>
                <div>
                    <input
                    type="date"
                    value={dataInput.expirationDate}
                    onChange={(e) => setDataInput({...dataInput, expirationDate: e.target.value})}
                    />
                </div>
            </div>
            <div className='label-text'>
                <label>REFILL PRICE:</label>
                <div>
                    <input type="number"
                    value={dataInput.refillPrice} 
                    onChange={(e) => setDataInput({...dataInput, refillPrice: e.target.value})} 
                    />
                </div>
            </div>
            <div className='label-text'>
                <label>DESCRIPTION:</label>
                <div>
                    <textarea
                        value={dataInput.description} 
                        onChange={(e) => setDataInput({...dataInput, description: e.target.value})}
                    />
                </div>
            </div>
            <div className='staff-modal-products-add-buttons'>
                <button onClick={handleUploadProductStaff}>OKAY</button>
                <button onClick={onClose}>CANCEL</button>
            </div>
        </form>
    </div>
  )
}

export default StaffModalProductsAddComponent