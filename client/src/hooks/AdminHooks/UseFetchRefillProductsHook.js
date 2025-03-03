import axios from 'axios';
import React, { useEffect, useState } from 'react'

export default function UseFetchRefillProductsHook(selectedCategory) {
    const [refillProducts, setRefillProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchRefillProducts = async(category = '') => {
        try {
            const response = await axios.get('/adminRefillProduct/getRefillProductsAdmin', {
                params: {category}
            });
            const productData = Array.isArray(response.data) ? response.data : [];
            setRefillProducts(productData);
            setLoading(false);
        } catch (error) {
            setError(error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRefillProducts(selectedCategory);
    }, [selectedCategory]);

  return {refillProducts, loading, error};
}
