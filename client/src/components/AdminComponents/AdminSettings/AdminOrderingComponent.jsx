import React, { useState, useEffect } from 'react'
import axios from 'axios';
import '../../../CSS/AdminCSS/AdminSettings/AdminOrderingComponent.css';
import { orderDate } from '../../../utils/OrderUtils';

function AdminOrderingComponent() {
    const [isDateModalOpen, setIsDateModalOpen] = useState(false);
    const [isTimeModalOpen, setIsTimeModalOpen] = useState(false);
    const [isUpdateDateModalOpen, setIsUpdateDateModalOpen] = useState(false);
    const [isUpdateTimeModalOpen, setIsUpdateTimeModalOpen] = useState(false);
    const [date, setDate] = useState('');
    const [timeSlots, setTimeSlots] = useState([{ start: '', end: '' }]);
    const [dates, setDates] = useState([]);
    const [times, setTimes] = useState([]);
    const [selectedDateId, setSelectedDateId] = useState(null);
    const [selectedTimeId, setSelectedTimeId] = useState(null);
    const [updateTime, setUpdateTime] = useState('');

    const fetchDates = async() => {
        try {
            const response = await axios.get('/adminDatePicker/getDate');
            setDates(response.data);
        } catch (error) {
            console.error('Error fetching dates:', error);
        }
    };

    const fetchTimes = async() => {
        try {
            const response = await axios.get('/adminDatePicker/getTime');
            setTimes(response.data);
        } catch (error) {
            console.error('Error fetching times:', error);
        }
    };

    useEffect(() => {
        fetchDates();
        fetchTimes();
    }, []);


    const handleTimeChange = (index, field, value) => {
        const updatedSlots = [...timeSlots];
        updatedSlots[index][field] = value;
        setTimeSlots(updatedSlots);
    };

    const handleAddDate = async() => {
        try {
            await axios.post('/adminDatePicker/addDate', {date});
                fetchDates();
                setDate('');
                setIsDateModalOpen(false);
        } catch (error) {
            console.error('Error adding date:', error);
        }
    };

    const handleAddTime = async() => {
        try {
        const formattedTimeSlots = timeSlots
            .map((slot) => `${slot.start} - ${slot.end}`)
            .join(', ');

        await axios.post('/adminDatePicker/addTime', {time: formattedTimeSlots});
            fetchTimes();
            setTimeSlots([{start: '', end: ''}]);
            setIsTimeModalOpen(false);
        } catch (error) {
            console.error('Error adding time:', error);
        }
    }

    //DELETE Date
    const handleDeleteDate = async(id) => {
        try {
            await axios.delete(`/adminDatePicker/deleteDate/${id}`);
            fetchDates();
        } catch (error) {
            console.error('Error deleting date:', error);
        }
    };

    //DELETE Time
    const handleDeleteTime = async(id) => {
        try {
            await axios.delete(`/adminDatePicker/deleteTime/${id}`);
            fetchTimes();
        } catch (error) {
            console.error('Error deleting time:', error);
        }
    };


    const handleUpdateDate = async () => {
        try {
            await axios.put(`/adminDatePicker/updateDate/${selectedDateId}`, { date });
            fetchDates();
            setDate('');
            setIsUpdateDateModalOpen(false);
        } catch (error) {
            console.error('Error updating date:', error);
        }
    };

    const handleUpdateTime = async () => {
        try {
            await axios.put(`/adminDatePicker/updateTime/${selectedTimeId}`, { time: updateTime });
            fetchTimes();
            setUpdateTime('');
            setIsUpdateTimeModalOpen(false);
        } catch (error) {
            console.error('Error updating time:', error);
        }
    };

    const openUpdateDateModal = (id, existingDate) => {
        setSelectedDateId(id);
        setDate(existingDate);
        setIsUpdateDateModalOpen(true);
    };

    const openUpdateTimeModal = (id, existingTime) => {
        setSelectedTimeId(id);
        setUpdateTime(existingTime);
        setIsUpdateTimeModalOpen(true);
    };
  return (
    <div className='admin-ordering-component'>
        <div className='action-buttons'>
            <button
            onClick={() => setIsDateModalOpen(true)}
            className='open-modal-button'
            >
            Add Date
            </button>
            <button
            onClick={() => setIsTimeModalOpen(true)}
            className='open-modal-button'
            >
            Add Time
            </button>
        </div>



        {
            isDateModalOpen && (
                <div className='modal-overlay'>
                    <div className='modal-content'>
                        <h2>Add Date</h2>
                        <div className='modal-body'>
                            <label>
                                Select Date:
                                <input
                                type='date'
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className='date-input'
                                />
                            </label>
                        </div>
                        <div className='modal-footer'>
                            <button onClick={handleAddDate} className='submit-button'>
                                Submit
                            </button>
                            <button
                            onClick={() => setIsDateModalOpen(false)}
                            className='close-button'
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )
        }


  
        {
            isTimeModalOpen && (
                <div className='modal-overlay'>
                    <div className='modal-content'>
                        <h2>Add Time</h2>
                        <div className='modal-body'>
                            <label>
                                Add Time Slots:
                                {
                                    timeSlots.map((slot, index) => (
                                    <div key={index} className='time-slot'>
                                        <input
                                        type='time'
                                        value={slot.start}
                                        onChange={(e) =>
                                            handleTimeChange(index, 'start', e.target.value)
                                        }
                                        className='time-input'
                                        />
                                        <span>to</span>
                                        <input
                                        type='time'
                                        value={slot.end}
                                        onChange={(e) =>
                                            handleTimeChange(index, 'end', e.target.value)
                                        }
                                        className='time-input'
                                        />
                                    </div>
                                    ))
                                }
                            </label>
                            {/* <button onClick={handleAddTimeSlot} className='add-time-button'>
                                Add Time Slot
                            </button> */}
                            </div>
                            <div className='modal-footer'>
                            <button onClick={handleAddTime} className='submit-button'>
                                Submit
                            </button>
                            <button
                            onClick={() => setIsTimeModalOpen(false)}
                            className='close-button'
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )
        }

         {/* update date modal */}
        {
            isUpdateDateModalOpen && (
                    <div className='modal-overlay'>
                        <div className='modal-content'>
                            <h2>Update Date</h2>
                            <div className='modal-body'>
                                <label>
                                    Select Date:
                                    <input
                                        type="date"
                                        value={date}
                                        onChange={(e) => setDate(e.target.value)}
                                        className='date-input'
                                    />
                                </label>
                            </div>
                            <div className='modal-footer'>
                                <button onClick={handleUpdateDate} className='submit-button'>
                                    Update
                                </button>
                                <button onClick={() => setIsUpdateDateModalOpen(false)} className='close-button'>
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }

            {
                isUpdateTimeModalOpen && (
                    <div className='modal-overlay'>
                        <div className='modal-content'>
                            <h2>Update Time</h2>
                            <div className='modal-body'>
                                <label>
                                    Update Time Slot:
                                    <input
                                        type="text"
                                        value={updateTime}
                                        onChange={(e) => setUpdateTime(e.target.value)}
                                        className='time-input'
                                        placeholder="E.g., 10:00 AM - 12:00 PM"
                                    />
                                </label>
                            </div>
                            <div className='modal-footer'>
                                <button onClick={handleUpdateTime} className='submit-button'>
                                    Update
                                </button>
                                <button onClick={() => setIsUpdateTimeModalOpen(false)} className='close-button'>
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }


        <div className='entries-list'>
            <h3>Unavailable Dates</h3>
            <table className='entries-table'>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Date</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        dates.map((entry, index) => (
                        <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{orderDate(entry.date)}</td>
                            <td>
                                <button className='delete-btn' onClick={() => handleDeleteDate(entry._id)}>Delete</button>
                                    {' '}
                                <button className='edit-btn' onClick={() => openUpdateDateModal(entry._id, entry.date)}>Edit</button>
                            </td>
                        </tr>
                        ))
                    }
                </tbody>
            </table>

            <h3>Available Times</h3>
            <table className='entries-table'>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Time Slots</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        times.map((entry, index) => (
                        <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{entry.time}</td>
                            <td>
                                <button className='delete-btn' onClick={() => handleDeleteTime(entry._id)}>Delete</button>
                                    {' '}
                                <button className='edit-btn' onClick={() => openUpdateTimeModal(entry._id, entry.time)}>Edit</button>
                            </td>
                        </tr>
                        ))
                    }
                </tbody>
            </table>
        </div>
    </div>
  )
}

export default AdminOrderingComponent
