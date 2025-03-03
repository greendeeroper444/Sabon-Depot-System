import axios from 'axios';
import React, { useState } from 'react'
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export default function UseCartRefillHook(admin) {
    const [cartItemsRefill, setCartItemsRefill] = useState([]);
    const navigate = useNavigate();

    const handleAddToCartClickRefill = async(adminId, productId, volume) => {
        if(!admin){
            toast.error('Please login first before adding a product to the cart');
            navigate('/admin-staff-login');
            return;
        }

        try {
            const response = await axios.post('/adminCartRefill/addProductToCartRefillAdmin', {
                adminId,
                productId,
                volume,
            });
            if(response.status === 200){
                setCartItemsRefill(response.data);
                // toast.success('Product successfully added to cart');
                return true;
            } else{
                throw new Error('Failed to add product to cart');
            }
        } catch (error) {
            console.error(error);
            return false;
        }
    };

  return {cartItemsRefill, setCartItemsRefill, handleAddToCartClickRefill};
}
