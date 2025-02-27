import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import { CustomerContext } from '../../../contexts/CustomerContexts/CustomerAuthContext';

export default function UseDirectCheckOutHook(customerId, selectedItems = [], navigate) {
    const [billingDetails, setBillingDetails] = useState({
        firstName: '',
        lastName: '',
        middleInitial: '',
        contactNumber: '',
        province: '',
        city: '',
        barangay: '',
        purokStreetSubdivision: '',
        emailAddress: '',
        clientType: '',
    });
    const [selectedDate, setSelectedDate] = useState(localStorage.getItem('selectedDate') || null);
    const [selectedTime, setSelectedTime] = useState(localStorage.getItem('selectedTime') || null);
    const [paymentMethod, setPaymentMethod] = useState('');
    const [total, setTotal] = useState(0);
    const [showCashOnDeliveryModal, setShowCashOnDeliveryModal] = useState(false);
    const [showPickupModal, setShowPickupModal] = useState(false);
    const { customer } = useContext(CustomerContext);

    useEffect(() => {
        setTotal(
            selectedItems.reduce((acc, item) => {
                const price =
                    customer?.isNewCustomer && new Date(customer?.newCustomerExpiresAt) > new Date()
                        ? item.productId.price * 0.7
                        : item.discountedPrice || item.productId.discountedPrice;
                return acc + price * item.quantity;
            }, 0)
        );
    }, [selectedItems, customer]);


    useEffect(() => {
        const fetchCustomerData = async() => {
            try {
                const response = await axios.get(`/customerAuth/getDataUpdateCustomer/${customerId}`);
                const customer = response.data.customer;
                setBillingDetails(prevDetails => ({
                    ...prevDetails,
                    firstName: customer.firstName,
                    lastName: customer.lastName,
                    middleInitial: customer.middleInitial,
                    contactNumber: customer.contactNumber,
                    province: customer.province,
                    city: customer.city,
                    barangay: customer.barangay,
                    purokStreetSubdivision: customer.purokStreetSubdivision,
                    emailAddress: customer.emailAddress,
                    clientType: customer.clientType,
                }));
            } catch (error) {
                console.error(error);
            }
        };

        if(customerId){
            fetchCustomerData();
        }
    }, [customerId]);

    useEffect(() => {
        const storedDate = localStorage.getItem('selectedDate');
        const storedTime = localStorage.getItem('selectedTime');
    
        if (storedDate && storedTime) {
            setSelectedDate(storedDate);
            setSelectedTime(storedTime);
            setPaymentMethod('Pick Up');
        }
    }, []);
    

    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setBillingDetails({ ...billingDetails, [name]: value });
    };

    const handlePaymentChange = (e) => {
        const {value} = e.target;
        setPaymentMethod(value);
        setShowCashOnDeliveryModal(value === 'Cash On Delivery');
        setShowPickupModal(value === 'Pick Up');
    };

    const handlePickupPayment = ({pickupDate, pickupTime}) => {
        setSelectedDate(pickupDate);
        setSelectedTime(pickupTime);

        //new
        localStorage.setItem('selectedDate', pickupDate);
        localStorage.setItem('selectedTime', pickupTime);

        toast.success('Pick-up details saved successfully!');
    };

    const handlePlaceOrder = async() => {
        if(!billingDetails.firstName || !billingDetails.lastName || !paymentMethod){
            toast.error('Please complete all required fields.');
            return;
        }
    
        if(selectedItems.length === 0 || !selectedItems[0]?.productId?._id){
            toast.error('No valid product selected.');
            return;
        }
    
        try {
            const orderData = {
                customerId,
                paymentMethod,
                billingDetails,
                pickupDate: selectedDate || undefined,
                pickupTime: selectedTime || undefined,
                productDetails: {_id: selectedItems[0].productId._id}, //correctly access _id
                quantity: selectedItems[0]?.quantity, //pass quantity
            };
    
            const {data} = await axios.post('/customerOrder/directCheckoutCustomer', orderData, {
                headers: {'Content-Type': 'application/json'},
            });
    
            if(data.orderId){
                navigate(`/place-order/${customerId}/${data.orderId}`);
                toast.success(data.message || 'Order placed successfully!');
            } else {
                throw new Error(data.message || 'Order ID missing from response.');
            }
        } catch (error) {
            console.error('Order creation failed:', error);
            toast.error(error.response?.data?.message || 'Server error');
        }
    };
    
    
    
    

  return {
    billingDetails,
    paymentMethod,
    total,
    showCashOnDeliveryModal,
    showPickupModal,
    handleInputChange,
    handlePaymentChange,
    handlePickupPayment,
    handlePlaceOrder,
    setShowCashOnDeliveryModal,
    setShowPickupModal,
    selectedDate,
    setSelectedDate,
    selectedTime,
    setSelectedTime,
  }
}
