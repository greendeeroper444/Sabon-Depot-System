import React, { useEffect, useState } from 'react'
import '../../../CSS/AdminCSS/AdminModalProducts/AdminModalProductsAdd.css';
import toast from 'react-hot-toast';
import axios from 'axios';
import { ChromePicker } from 'react-color';

function StaffModalRefillProductsAddComponent({isOpen, onClose, fetchRefillProducts}) {
    const [categories, setCategories] = useState([]);
    const [dataInput, setDataInput] = useState({
        productName: '', 
        category: '', 
        price: '', 
        volume: '',
        color: '#ff0000'
    })
    const [showPicker, setShowPicker] = useState(false);

    const handleChangeComplete = (color) => {
        setDataInput((prevState) => ({
            ...prevState,
            color: color.hex, 
        }));
    };

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
    
    if(!isOpen) return null;

    const handleAddProductAdmin = async (e) => {
        e.preventDefault();
        const {productName, category, price, volume, color} = dataInput;
    
        if(!productName || !category || !price || !volume){
            toast.error('Please input all fields');
            return;
        }
    
        if(volume > 105){
            toast.error('volume cannot exceed 105');
            return;
        }

        const productData = {productName, category, price, volume, color};
    
        try {
            const response = await axios.post('/staffRefillProduct/addRefillProductStaff', productData, {
                headers: { 
                    'Content-Type': 'application/json' 
                }
            });
    
            if(response.data.error){
                toast.error(response.data.error);
            } else {
                setDataInput({ 
                    productName: '', 
                    category: '', 
                    price: '', 
                    volume: '',
                    color: '#ff0000'
                });
                toast.success(response.data.message);
                onClose();
                fetchRefillProducts();
            }
        } catch (error) {
            console.log(error);
        }
    };
  

  return (
    <div className='admin-modal-products-add-container'>
        <form className='admin-modal-products-add-content'>
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
                <label>CATEGORY:</label>
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
                <label>PRICE:</label>
                <div>
                    <input type="number"
                    value={dataInput.price} 
                    onChange={(e) => setDataInput({...dataInput, price: e.target.value})} 
                    />
                </div>
            </div>
            <div className='label-text'>
                <label>Volume:</label>
                <div>
                    <input type="number"
                    value={dataInput.volume} 
                    onChange={(e) => setDataInput({...dataInput, volume: e.target.value})}
                    />
                </div>
            </div>
            <div style={{ position: 'relative' }}>
                <label style={{ fontWeight: 'bold' }}>COLOR:</label>
                <div style={{ position: 'relative' }}>
                    <div 
                    onClick={() => setShowPicker(!showPicker)}
                    style={{
                    width: '50px',
                    height: '50px',
                    backgroundColor: dataInput.color,
                    border: '1px solid #000',
                    cursor: 'pointer',
                    display: 'inline-block',
                    marginLeft: '10px',
                    }}
                    ></div>

                    {
                        showPicker && (
                            <div style={{ position: 'absolute', zIndex: 2 }}>
                                <ChromePicker
                                color={dataInput.color}
                                onChangeComplete={handleChangeComplete}
                                />
                            </div>
                        )
                    }
                </div>
            </div>
            <div className='admin-modal-products-add-buttons'>
                <button onClick={handleAddProductAdmin}>OKAY</button>
                <button onClick={onClose}>CANCEL</button>
            </div>
        </form>
    </div>
  )
}

export default StaffModalRefillProductsAddComponent