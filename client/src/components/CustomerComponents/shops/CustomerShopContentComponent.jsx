import React, { useContext, useState, useEffect } from 'react'
import '../../../CSS/CustomerCSS/Shop/CustomerShopContent.css';
import { Link } from 'react-router-dom';
import { CustomerContext } from '../../../../contexts/CustomerContexts/CustomerAuthContext';
import UseFetchCategoriesHook from '../../../hooks/CustomerHooks/UseFetchCategoriesHook';
import UseFetchProductsHook from '../../../hooks/CustomerHooks/UseFetchProductsHook';
import IsDiscountValidUtils from '../../../utils/IsDiscountValidUtils';
import axios from 'axios';

function CustomerShopContentComponent() {
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedSizeUnit, setSelectedSizeUnit] = useState('');
    const {customer} = useContext(CustomerContext);
    const [showCount, setShowCount] = useState(16);
    const [sizeUnits, setSizeUnits] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);

    const categories = UseFetchCategoriesHook();
    const {products, loading, error} = UseFetchProductsHook(selectedCategory);

    useEffect(() => {
        //fetch all distinct sizeUnits when component mounts
        const fetchSizeUnits = async() => {
            try {
                const response = await axios.get('/customerProduct/getProductCustomer');
                const distinctSizeUnits = [...new Set(response.data.map(product => product.sizeUnit))];
                setSizeUnits(distinctSizeUnits);
            } catch (error) {
                console.error('Error fetching size units:', error);
            }
        };

        fetchSizeUnits();
    }, []);

    useEffect(() => {
        //if selectedSizeUnit changes, filter products accordingly
        const fetchFilteredProducts = async() => {
            if(selectedSizeUnit){
                try {
                    const response = await axios.get('/customerProduct/getProductCustomer', {
                        params: {sizeUnit: selectedSizeUnit},
                    });
                    setFilteredProducts(response.data);
                } catch (error) {
                    console.error('Error fetching filtered products:', error);
                }
            }
        };

        fetchFilteredProducts();
    }, [selectedSizeUnit]);

    if(loading){
        return <div>Loading...</div>;
    }

    if(error){
        return <div>Error: {error.message}</div>;
    }

  return (
    <div className='customer-shop-content-container'>
        <div className='customer-shop-content-header'>
            <div className='customer-shop-content-header-left'>
                {/* <div>
                    <select 
                    name='category' 
                    id='category'
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    >
                        <option value=''>All Products</option>
                        {
                            categories.map((category) => (
                                <option key={category} value={category}>{category}</option>
                            ))
                        }
                    </select>
                </div> */}
                {/* <div>
                    <span>Showing {filteredProducts.length} results</span>
                </div> */}
            </div>
            {/* <div className='customer-shop-content-header-section-right'>
                <span>Show</span>
                <button onClick={() => setShowCount(showCount === 16 ? 32 : 16)}>
                    {showCount}
                </button>
            </div> */}
        </div>


        <br />
        <br />
        <br />

        <div className='shop-products-content'>
            <div className='size-unit-options'>
                <ul>
                    {
                        sizeUnits.map((sizeUnit) => (
                            <li
                            key={sizeUnit}
                            className={`size-unit-card ${selectedSizeUnit === sizeUnit ? 'active' : ''}`}
                            >
                                <Link to={`/shop/product?sizeUnit=${sizeUnit}`} className='size-unit-link'>
                                    {sizeUnit}
                                </Link>
                            </li>
                        ))
                    }
                </ul>
            </div>

        </div>
    </div>
  )
}

export default CustomerShopContentComponent
