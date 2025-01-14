import axios from 'axios'
import { useEffect, useState } from 'react';

export default function UseFetchProductsHook(selectedCategory, selectedSizeUnit) {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const response = await axios.get('/customerProduct/getProductCustomer', {
                    params: {category: selectedCategory, sizeUnit: selectedSizeUnit},
                });
                setProducts(response.data);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [selectedCategory, selectedSizeUnit]);

    return {products, loading, error};
}
