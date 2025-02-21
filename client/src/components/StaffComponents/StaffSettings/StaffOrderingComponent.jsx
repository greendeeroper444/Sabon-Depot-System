import React, { useState, useEffect } from 'react'
import axios from 'axios';
import '../../../CSS/AdminCSS/AdminSettings/AdminOrderingComponent.css';
import { orderDate } from '../../../utils/OrderUtils';

function StaffOrderingComponent() {
    const [isDateModalOpen, setIsDateModalOpen] = useState(false);
    const [isTimeModalOpen, setIsTimeModalOpen] = useState(false);
    const [isUpdateDateModalOpen, setIsUpdateDateModalOpen] = useState(false);
    const [isUpdateTimeModalOpen, setIsUpdateTimeModalOpen] = useState(false);
    const [date, setDate] = useState('');
    const [dates, setDates] = useState([]);
    const [selectedDateId, setSelectedDateId] = useState(null);
    const [selectedTimeId, setSelectedTimeId] = useState(null);
    const [timeSlots, setTimeSlots] = useState([]);
    const [newStartTime, setNewStartTime] = useState('');
    const [newEndTime, setNewEndTime] = useState('');
    const [updatedStartTime, setUpdatedStartTime] = useState('');
    const [updatedEndTime, setUpdatedEndTime] = useState('');
    
    const fetchDates = async() => {
        try {
            const response = await axios.get('/adminDatePicker/getDate');
            setDates(response.data);
        } catch (error) {
            console.error('Error fetching dates:', error);
        }
    };

    const fetchTimes = async () => {
        try {
            const response = await axios.get('/adminDatePicker/getAllTimeSlots');
            setTimeSlots(response.data);
        } catch (error) {
            console.error('Error fetching time slots:', error);
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

    const handleDeleteDate = async(id) => {
        try {
            await axios.delete(`/adminDatePicker/deleteDate/${id}`);
            fetchDates();
        } catch (error) {
            console.error('Error deleting date:', error);
        }
    };

    const openUpdateDateModal = (id, existingDate) => {
        setSelectedDateId(id);
        setDate(existingDate);
        setIsUpdateDateModalOpen(true);
    };


    const handleCreateTimeSlot = async () => {
        try {
            await axios.post('/adminDatePicker/createTimeSlot', {
                startTime: newStartTime,
                endTime: newEndTime
            });
            fetchTimes();
            setNewStartTime('');
            setNewEndTime('');
            setIsTimeModalOpen(false);
        } catch (error) {
            console.error('Error creating time slot:', error);
        }
    };

    
    const handleDeleteTime = async (id) => {
        try {
            await axios.delete(`/adminDatePicker/deleteTime/${id}`);
            fetchTimes();
        } catch (error) {
            console.error('Error deleting time:', error);
        }
    };

    const handleUpdateTimeSlot = async () => {
        if (!selectedTimeId) return;
        try {
            await axios.put(`/adminDatePicker/updateTimeSlot/${selectedTimeId}`, {
                startTime: updatedStartTime,
                endTime: updatedEndTime
            });
            fetchTimes();
            setUpdatedStartTime('');
            setUpdatedEndTime('');
            setIsUpdateTimeModalOpen(false);
        } catch (error) {
            console.error('Error updating time slot:', error);
        }
    };

    const openUpdateTimeModal = (id, time) => {
        setSelectedTimeId(id);
        setUpdatedStartTime(time.startTime);
        setUpdatedEndTime(time.endTime);
        setIsUpdateTimeModalOpen(true);
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
                                Start Time:
                                <input
                                type='time'
                                value={newStartTime}
                                onChange={(e) => setNewStartTime(e.target.value)}
                                className='time-input'
                                />
                            </label>
                            <label>
                                End Time:
                                <input
                                type='time'
                                value={newEndTime}
                                onChange={(e) => setNewEndTime(e.target.value)}
                                className='time-input'
                                />
                            </label>
                        </div>
                        <div className='modal-footer'>
                            <button onClick={handleCreateTimeSlot} className='submit-button'>Submit</button>
                            <button onClick={() => setIsTimeModalOpen(false)} className='close-button'>Cancel</button>
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
                                Start Time:
                                <input
                                type='time'
                                value={updatedStartTime}
                                onChange={(e) => setUpdatedStartTime(e.target.value)}
                                className='time-input'
                                />
                            </label>
                            <label>
                                End Time:
                                <input
                                type='time'
                                value={updatedEndTime}
                                onChange={(e) => setUpdatedEndTime(e.target.value)}
                                className='time-input'
                                />
                            </label>
                        </div>
                        <div className='modal-footer'>
                            <button onClick={handleUpdateTimeSlot} className='submit-button'>Update</button>
                            <button onClick={() => setIsUpdateTimeModalOpen(false)} className='close-button'>Cancel</button>
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
                            <th>Start Time</th>
                            <th>End Time</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            timeSlots.map((entry, index) => (
                                <tr key={entry._id}>
                                    <td>{index + 1}</td>
                                    <td>{new Date(`1970-01-01T${entry.time.startTime}`).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true })}</td>
                                    <td>{new Date(`1970-01-01T${entry.time.endTime}`).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true })}</td>

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

export default StaffOrderingComponent
