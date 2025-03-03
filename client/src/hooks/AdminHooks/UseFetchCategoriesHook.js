import axios from 'axios';
import React, { useEffect, useState } from 'react'

export default function UseFetchCategoriesRefillProductHook() {
    const [categories, setCategories] = useState([]);

    const fetchCategories = async() => {
        try {
            const response = await axios.get('/adminProduct/getUniqueCategoriesAdmin');
            setCategories(response.data);
        } catch (error) {
            console.error(error);
        }
    };
    useEffect(() => {
        fetchCategories();
    }, []);

  return categories;
}
