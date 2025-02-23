import React, { useContext, useEffect, useState } from 'react'
import '../../CSS/CustomerCSS/CustomerRegister.css'
import googleIcon from '../../assets/icons/google-icon.png'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-regular-svg-icons';
import vectorLeft from '../../assets/vectors/register-vector-left.png';
import vectorRight from '../../assets/vectors/register-vector-right.png';
import { Link, useNavigate } from 'react-router-dom';
import { CustomerContext } from '../../../contexts/CustomerContexts/CustomerAuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import {
    regions,
    provinces,
    cities,
    barangays,
  } from 'select-philippines-address';


function CustomerRegisterPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
    const navigate = useNavigate();
    const {setCustomer} = useContext(CustomerContext);
    const [data, setData] = useState({
        firstName: '', 
        lastName: '', 
        middleInitial: '', 
        contactNumber: '', 
        province: '',  
        city: '',
        barangay: '',
        purokStreetSubdivision: '',
        emailAddress: '',
        password: '',
        confirmPassword: '',
        clientType: ''
    });
    const [step, setStep] = useState(1);

    const [regionList, setRegionList] = useState([]);
    const [provinceList, setProvinceList] = useState([]);
    const [cityList, setCityList] = useState([]);
    const [barangayList, setBarangayList] = useState([]);

    const [selectedRegion, setSelectedRegion] = useState('');
    const [selectedProvince, setSelectedProvince] = useState('');
    const [selectedCity, setSelectedCity] = useState('');
    const [selectedBarangay, setSelectedBarangay] = useState('');

    //fetch regions on mount
    useEffect(() => {
        const fetchRegions = async() => {
            try {
                const data = await regions();
                //include only the specified mindanao regions
                const mindanaoRegions = data.filter(region =>
                    [
                        'REGION IX (ZAMBOANGA PENINZULA)',
                        'REGION X (NORTHERN MINDANAO)',
                        'REGION XI (DAVAO REGION)',
                        'REGION XII (SOCCSKSARGEN)',
                        'AUTONOMOUS REGION IN MUSLIM MINDANAO (ARMM)'
                    ].includes(region.region_name.toUpperCase())
                );
    
                setRegionList(mindanaoRegions);
            } catch (error) {
                console.error('Error fetching regions:', error);
            }
        };
    
        fetchRegions();
    }, []);
    
    //display davao region automatic selected
    // useEffect(() => {
    //     const fetchRegions = async() => {
    //         try {
    //             const data = await regions();
    //             //filter only REGION XI (DAVAO REGION)
    //             const davaoRegion = data.find(region => region.region_name.toUpperCase() === 'REGION XI (DAVAO REGION)');
                
    //             if(davaoRegion){
    //                 setSelectedRegion(davaoRegion);
    //                 setData(prevData => ({...prevData, region: davaoRegion.region_name}));
    
    //                 //fetch and set provinces for Region XI
    //                 const provinceData = await provinces(davaoRegion.region_code);
    //                 setProvinceList(provinceData);
    //             }
    //         } catch (error) {
    //             console.error('Error fetching region/provinces:', error);
    //         }
    //     };
    
    //     fetchRegions();
    // }, []);

    
    //handle region change
    const handleRegionChange = async(e) => {
        const regionCode = e.target.value;
        const selectedRegion = regionList.find((region) => region.region_code === regionCode);
        setSelectedRegion(selectedRegion);
        setData((prevData) => ({ ...prevData, region: selectedRegion.region_name }));
        resetSelections(['province', 'city', 'barangay']);
        if(regionCode){
            try {
                const data = await provinces(regionCode);
                setProvinceList(data);
            } catch (error) {
                console.error('Error fetching provinces:', error);
            }
        }
    };

    //handle province change
    const handleProvinceChange = async(e) => {
        const provinceCode = e.target.value;
        const selectedProvince = provinceList.find((province) => province.province_code === provinceCode);
        setSelectedProvince(selectedProvince);
        setData((prevData) => ({...prevData, province: selectedProvince.province_name}));
        resetSelections(['city', 'barangay']);
        if(provinceCode){
            try {
                const data = await cities(provinceCode);
                setCityList(data);
            } catch (error) {
                console.error('Error fetching cities:', error);
            }
        }
    };

    //handle city change
    const handleCityChange = async (e) => {
        const cityCode = e.target.value;
        const selectedCity = cityList.find((city) => city.city_code === cityCode);
        setSelectedCity(selectedCity);
        setData((prevData) => ({ ...prevData, city: selectedCity.city_name }));
        resetSelections(['barangay']);
        if(cityCode){
            try {
                const data = await barangays(cityCode);
                setBarangayList(data);
            } catch (error) {
                console.error('Error fetching barangays:', error);
            }
        }
    };

    //handle barangay change
    const handleBarangayChange = (e) => {
        const barangayCode = e.target.value;
        const selectedBarangay = barangayList.find((barangay) => barangay.brgy_code === barangayCode);
        setSelectedBarangay(selectedBarangay);
        setData((prevData) => ({...prevData, barangay: selectedBarangay.brgy_name}));
    };

    //reset dependent selections
    const resetSelections = (fields) => {
        if(fields.includes('province')){
            setSelectedProvince('');
            setProvinceList([]);
        }
        if(fields.includes('city')){
            setSelectedCity('');
            setCityList([]);
        }
        if(fields.includes('barangay')){
            setSelectedBarangay('');
            setBarangayList([]);
        }
    };
  

    const handleNextStep = (e) => {
        e.preventDefault();
        // setStep(step + 1); 
        //validation for step 1
        if(step === 1){
            const {firstName, lastName, clientType} = data;
            if(!firstName || !lastName || !clientType){
                toast.error('Please fill in all required fields.');
                return;
            }
        }

        //validation for step 2
        if(step === 2){
            const {contactNumber, province, city, barangay, purokStreetSubdivision} = data;
            if(!contactNumber || !province || !city || !barangay || !purokStreetSubdivision){
                toast.error('Please fill in all required fields.');
                return;
            }

            if(!/^\d{11}$/.test(contactNumber)){
                toast.error('Contact number should only contain 11 digits.');
                return;
            }
        }

        //validation for step 3
        if(step === 3){
            const {emailAddress, password} = data;
            if(!emailAddress || !password){
                toast.error('Please fill in all required fields.');
                return;
            }
        }

        setStep(step + 1); //proceed to the next step
    };

    const handlePreviousStep = (e) => {
        e.preventDefault();
        setStep(step - 1);
    };


    const handleRegister = async(e) => {
        e.preventDefault();
        const {
            firstName, 
            lastName, 
            middleInitial, 
            contactNumber, 
            province,  
            city,
            barangay,
            purokStreetSubdivision, 
            emailAddress, 
            password,
            confirmPassword,
            clientType
        } = data;

        //check if passwords match
        if(password !== confirmPassword){
            toast.error('Passwords do not match. Please try again.');
            return;
        }

        const loadingToast = toast.loading('Sending OTP email...');

        try {
            const response = await axios.post('/customerAuth/registerCustomer', {
                firstName, 
                lastName, 
                middleInitial, 
                contactNumber, 
                province,  
                city,
                barangay,
                purokStreetSubdivision,
                emailAddress,
                password,
                clientType
            });

            //dismiss the waiting toast
            toast.dismiss(loadingToast);

            if(response.data.error){
                toast.error(response.data.error);
            } else{
                setData({});
                setCustomer(response.data.customer);
                navigate('/otp', {
                    state: {emailAddress}
                });
                toast.success(response.data.message);
            }
        } catch (error) {
            toast.dismiss(loadingToast);
            console.log(error);
            toast.error('An error occurred. Please try again.');
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };
    const toggleConfirmPasswordVisibility = () => {
        setShowPasswordConfirm(!showPasswordConfirm);
    }

  return (
    <>
        <div className='customer-register-container'>
            <h2 className='customer-register-header'>Create an Account</h2>

            <br />
            <form action="" className='customer-register-form' onSubmit={handleRegister}>
                {
                    step === 1 && (
                        <motion.span
                        initial={{ x: '-100%' }} 
                        animate={{ x: 0 }} 
                        exit={{ x: '100%' }} 
                        transition={{ duration: 0.5 }}>
                            <div>

                               <div className='two-display'>
                                    <div className='form-group'>
                                        <label htmlFor="firstName">First Name</label>
                                        <input type="text" className='form-input' id='firstName'
                                        value={data.firstName} onChange={(e) =>setData({...data, firstName: e.target.value})} />
                                    </div>

                                    <div className='form-group'>
                                        <label htmlFor="lastName">Last Name</label>
                                        <input type="text" className='form-input' id='lastName'
                                        value={data.lastName} onChange={(e) =>setData({...data, lastName: e.target.value})} />
                                    </div>
                               </div>
                                
                               <div className='two-display'>
                                    
                                    <div className='form-group'>
                                        <label htmlFor="middleInitial">Middle Name</label>
                                        <input type="text" placeholder='Optional' className='form-input' id='middleInitial'
                                        value={data.middleInitial} onChange={(e) =>setData({...data, middleInitial: e.target.value})} />
                                    </div>
                                    <div className='form-group'>
                                        <label htmlFor="clientType">Client Type</label>
                                        <select id='clientType' value={data.clientType} 
                                            onChange={(e) => setData({...data, clientType: e.target.value})}>
                                            <option value=""> Select Client Type</option>
                                            <option value="Individual">Individual</option>
                                            <option value="Wholesaler">Wholesaler</option>
                                        </select>
                                    </div>
                               </div>
                            </div>
                            <div className='form-group'>
                                <span>Please click &quot;Next&quot; to proceed to the next step.</span>
                            </div>
                           
                            <button type='submit' className='customer-register-button' onClick={handleNextStep}>Next...</button>
                        </motion.span>
                    )
                }



                {/* second */}
                {
                    step === 2 && (
                        <motion.span
                        initial={{ x: '100%' }} 
                        animate={{ x: 0 }} 
                        exit={{ x: '-100%' }} 
                        transition={{ duration: 0.5 }}
                        >
                            <div>

                                <div className='two-display'>
                                    <div className='form-group'>
                                        <label htmlFor="region">Region:</label>
                                        <select
                                        id='region'
                                        value={selectedRegion ? selectedRegion.region_code : ''}
                                        onChange={handleRegionChange}
                                        >
                                        <option value="">Select Region</option>
                                        {
                                            regionList.map((region) => (
                                                <option key={region.region_code} value={region.region_code}>
                                                {region.region_name}
                                                </option>
                                            ))
                                        }
                                        </select>
                                    </div>

                                    <div className='form-group'>
                                        <label htmlFor="province">Province:</label>
                                        <select
                                        id='province'
                                        value={selectedProvince ? selectedProvince.province_code : ''}
                                        onChange={handleProvinceChange}
                                        disabled={!selectedRegion}
                                        >
                                        <option value="">Select Province</option>
                                        {
                                            provinceList.map((province) => (
                                                <option key={province.province_code} value={province.province_code}>
                                                {province.province_name}
                                                </option>
                                            ))
                                        }
                                        </select>
                                    </div>
                                </div>

                               <div className='two-display'>
                                <div className='form-group'>
                                        <label htmlFor="city">City:</label>
                                        <select
                                        id='city'
                                        value={selectedCity ? selectedCity.city_code : ''}
                                        onChange={handleCityChange}
                                        disabled={!selectedProvince}
                                        >
                                        <option value="">Select City</option>
                                        {
                                            cityList.map((city) => (
                                                <option key={city.city_code} value={city.city_code}>
                                                {city.city_name}
                                                </option>
                                            ))
                                        }
                                        </select>
                                    </div>

                                    <div className='form-group'>
                                        <label htmlFor="barangay">Barangay:</label>
                                        <select
                                        id='barangay'
                                        value={selectedBarangay ? selectedBarangay.brgy_code : ''}
                                        onChange={handleBarangayChange}
                                        disabled={!selectedCity}
                                        >
                                        <option value="">Select Barangay</option>
                                        {
                                            barangayList.map((barangay) => (
                                                <option key={barangay.brgy_code} value={barangay.brgy_code}>
                                                {barangay.brgy_name}
                                                </option>
                                            ))
                                        }
                                        </select>
                                    </div>
                               </div>
                                
                               <div className='two-display'>
                                    
                                    <div className='form-group'>
                                        <label htmlFor="purokStreetSubdivision">Purok/Street/Subd.</label>
                                        <input type="text" className='form-input' id='purokStreetSubdivision'
                                            value={data.purokStreetSubdivision} 
                                            onChange={(e) => setData({...data, purokStreetSubdivision: e.target.value})}
                                        />
                                    </div>
                                    <div className='form-group'>
                                        <label htmlFor="contactNumber">Contact #</label>
                                        <input type="number" className='form-input' id='contactNumber'
                                            value={data.contactNumber} 
                                            onChange={(e) => setData({...data, contactNumber: e.target.value})}
                                        />
                                    </div>
                               </div>
                            </div>

                            <button type='submit' className='customer-register-button' onClick={handleNextStep}>Next...</button>
                            <button type='submit' className='customer-back-button' onClick={handlePreviousStep}>Back</button>
                           

                        </motion.span>
                    )
                }

                {
                    step === 3 && (
                        <motion.span
                        initial={{ x: '100%' }} 
                        animate={{ x: 0 }} 
                        exit={{ x: '-100%' }} 
                        transition={{ duration: 0.5 }}
                        >
                            <div className='form-group'>
                                <label htmlFor="email">Email Address</label>
                                <input type="email" className='form-input' id='email'
                                value={data.emailAddress} onChange={(e) =>setData({...data, emailAddress: e.target.value})} />
                            </div>
                            
                            <div className='form-group'>
                                <label htmlFor="password">Password</label>
                                <div className='password-input'>
                                    <input
                                    type={showPassword ? 'text' : 'password'}
                                    className='form-input'
                                    id='password'
                                    value={data.password} onChange={(e) => setData({...data, password: e.target.value})}
                                    />
                                    <FontAwesomeIcon
                                    icon={showPassword ? faEyeSlash : faEye}
                                    onClick={togglePasswordVisibility}
                                    className='password-icon'
                                    />
                                </div>
                            </div>
                            
                            <div className='form-group'>
                                <label htmlFor="confirmPassword">Confirm Password</label>
                                <div className='password-input'>
                                    <input
                                    type={showPasswordConfirm ? 'text' : 'password'}
                                    className='form-input'
                                    id='confirmPassword'
                                    value={data.confirmPassword}
                                    onChange={(e) => setData({...data, confirmPassword: e.target.value})}
                                    />
                                    <FontAwesomeIcon
                                    icon={showPasswordConfirm ? faEyeSlash : faEye}
                                    onClick={toggleConfirmPasswordVisibility}
                                    className='password-icon'
                                    />
                                </div>
                            </div>

                            <div className='form-group'>
                                <span>By continuing, you agree to our <Link to='/terms-and-conditions' className='terms-of-service'>terms of service.</Link></span>
                            </div>
                           
                            <button type='submit' className='customer-register-button'>Sign up</button>
                            <button type='submit' className='customer-back-button' onClick={handlePreviousStep}>Back</button>
                        </motion.span>
                    )
                }
                
                {/* <div className='or-sign-up'>
                    <span className='divider-line'></span>
                    <span className='divider-text'>or sign in with</span>
                    <span className='divider-line'></span>
                </div>
                
                <button type='button' className='google-register-button'>
                    <img src={googleIcon} alt='Google Icon' />
                    Continue with Google
                </button> */}
                
                <br />
                <div className='already-account'>Already have an account?<Link to='/login' className='signin-here'> Sign in here</Link></div>
            </form>
        </div>
        <div className='customer-register-vectors'>
            <img src={vectorLeft} className='vector-left' alt="" />
            <img src={vectorRight} className='vector-right' alt="" />
        </div>
    </>
  )
}

export default CustomerRegisterPage