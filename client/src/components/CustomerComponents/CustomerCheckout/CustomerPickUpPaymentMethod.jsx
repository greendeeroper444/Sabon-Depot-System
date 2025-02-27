import React, { useState, useEffect } from 'react'
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import '../../../CSS/CustomerCSS/CustomerCheckout/CustomerPickUpPaymentMethod.css';
import { toast } from 'react-hot-toast';
import moment from 'moment-timezone';


const CustomerPickUpPaymentMethod = ({
    onClose,
    handlePickupPayment,
    selectedDate,
    selectedTime,
    setSelectedDate,
    setSelectedTime,
}) => {
    const [unavailableDates, setUnavailableDates] = useState([]);
    const [availableTimes, setAvailableTimes] = useState([]);
    const [localSelectedDate, setLocalSelectedDate] = useState(
        selectedDate ? new Date(selectedDate) : null
    );
    const [localSelectedTime, setLocalSelectedTime] = useState(selectedTime || '');

    //fetch unavailable dates from the backend
    useEffect(() => {
        const fetchUnavailableData = async() => {
            try {
                const response = await axios.get('/customerDatePicker/getDateUnavailable');
                setUnavailableDates(response.data.unavailable || []);
            } catch (error) {
                console.error('Error fetching unavailable dates:', error);
                setUnavailableDates([]);
            }
        };

        fetchUnavailableData();
    }, []);

    // Fetch available times from the backend
    useEffect(() => {
        const fetchAvailableTimes = async() => {
            try {
                const response = await axios.get('/customerDatePicker/getTimeAvailable');
                setAvailableTimes(response.data || []);
            } catch (error) {
                console.error('Error fetching available times:', error);
                setAvailableTimes([]);
            }
        };

        fetchAvailableTimes();
    }, []);

    //determine if a date should be disabled
    const isDateDisabled = (date) => {
        const dateString = moment(date).tz('Asia/Singapore').format('YYYY-MM-DD');
        return unavailableDates.includes(dateString);
    };

    //handle date change
    const handleDateChange = (date) => {
        if(!date) return;

        const dateString = date.toISOString().split('T')[0];
        setLocalSelectedDate(date);
        setSelectedDate(dateString);
        setLocalSelectedTime('');
        setSelectedTime('');
    };

    //handle time change
    const handleTimeChange = (e) => {
        const time = e.target.value;
        setLocalSelectedTime(time);
        setSelectedTime(time);
    };

    //reset to default state when Cancel is clicked
    const handleCancel = () => {
        setLocalSelectedDate(null);
        setLocalSelectedTime('');
        setSelectedDate(null);
        setSelectedTime('');
        onClose?.();
    };

    //submit the selected date and time
    const handleSubmit = () => {
        if(!localSelectedDate || !localSelectedTime){
            toast.error('Please select both a date and time before submitting.');
            return;
        }
        handlePickupPayment({
            pickupDate: localSelectedDate.toISOString().split('T')[0],
            pickupTime: localSelectedTime,
        });
        onClose?.();
    };

  return (
    <div className='customer-pickup-payment-container'>
        <div className='customer-pickup-payment-content'>
            <h2>Pick-Up Date & Time</h2>

            {/* date picker */}
            <DatePicker
            selected={localSelectedDate}
            onChange={handleDateChange}
            filterDate={(date) => !isDateDisabled(date)}
            dateFormat="yyyy-MM-dd"
            placeholderText="Select a date"
            className='date-picker'
            />

            {/*time dropdown */}
            <select
            value={localSelectedTime}
            onChange={handleTimeChange}
            disabled={!localSelectedDate}
            >
                <option value="" disabled>
                    Select a time
                </option>
                {
                    availableTimes.map((entry) => (
                        <option key={entry._id} value={entry.formattedTime}>
                            {entry.formattedTime}
                        </option>
                    ))
                }
            </select>

            {
                localSelectedDate && localSelectedTime && (
                    <div className='time-display'>
                        {
                            localSelectedDate.toLocaleDateString(undefined, {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                            })
                        }
                        <br />
                        {localSelectedTime}
                    </div>
                )
            }

            <div className='disclaimer'>
                <p>
                    <strong>Disclaimer:</strong> If your order is not picked up on the selected date and time, 
                    it will be automatically canceled.
                </p>
            </div>

            <div className='modal-buttons'>
                <button className='cancel-button' onClick={handleCancel}>
                    Cancel
                </button>
                <button className='submit-button' onClick={handleSubmit}>
                    Submit
                </button>
            </div>
        </div>
    </div>
  )
}

export default CustomerPickUpPaymentMethod

