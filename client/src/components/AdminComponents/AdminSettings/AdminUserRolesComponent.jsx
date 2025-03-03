import React, { useEffect, useState } from 'react'
import '../../../CSS/AdminCSS/AdminSettings/AdminUserRolesComponent.css';
import axios from 'axios';
import toast from 'react-hot-toast';

function AdminUserRolesComponent() {
    const [isUserModalOpen, setIsUserModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editingUserId, setEditingUserId] = useState(null);
    const [userType, setUserType] = useState('Staff');
    const [clientType, setClientType] = useState('');
    const [firstName, setFirstName] = useState('');
    const [middleInitial, setMiddleInitial] = useState('');
    const [lastName, setLastName] = useState('');
    const [fullName, setFullName] = useState('');
    const [emailAddress, setEmailAddress] = useState('');
    const [contactNumber, setContactNumber] = useState('');
    const [password, setPassword] = useState('');
    const [accounts, setAccounts] = useState([]);

    //fetch accounts based on userType
    useEffect(() => {
        fetchAccounts(userType);
    }, [userType]);

    const fetchAccounts = async(type) => {
        try {
            const response = await axios.get(`/adminUsers/getUserAccount?userType=${type}`);
            setAccounts(response.data);
        } catch (error) {
            console.error(`Error fetching ${type} accounts:`, error);
        }
    };

    const openModal = (user = null) => {
        if(user){
            setIsEditing(true);
            setEditingUserId(user._id);
            if (userType === 'Customer') {
                setFirstName(user.firstName);
                setMiddleInitial(user.middleInitial);
                setLastName(user.lastName);
            } else {
                setFullName(user.fullName);
            }
            setEmailAddress(user.emailAddress);
            setContactNumber(user.contactNumber);
            setPassword('');
            if(userType === 'Customer') setClientType(user.clientType);
        } else{
            setIsEditing(false);
            setEditingUserId(null);
            setFullName('');
            setFirstName('');
            setMiddleInitial('');
            setLastName('');
            setEmailAddress('');
            setContactNumber('');
            setPassword('');
            setClientType('');
        }
        setIsUserModalOpen(true);
    };

    const handleUserSubmit = async() => {
        try {
            const userData = userType === 'Customer' 
                ? {firstName, middleInitial, lastName, emailAddress, contactNumber, clientType, password}
                : {fullName, emailAddress, contactNumber, password};

            if(isEditing){
                await axios.put(`/adminUsers/updateUserAccount/${editingUserId}`, {
                    userType,
                    ...userData,
                });
                toast.success(`${userType} account updated successfully`);
            } else{
                await axios.post('/adminUsers/addUserAccount', {
                    userType,
                    password,
                    ...userData,
                });
                toast.success(`${userType} account created successfully`);
            }
            fetchAccounts(userType);
            setIsUserModalOpen(false);
        } catch (error) {
            console.error(`Error ${isEditing ? 'updating' : 'adding'} user:`, error);
        }
    };

    const handleDeleteUser = async(id) => {
        try {
            await axios.delete(`/adminUsers/deleteUserAccount/${id}`, {
                data: {userType},
            });
            toast.success(`${userType} account deleted successfully`);
            fetchAccounts(userType);
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };

  return (
    <div className='admin-user-roles-container'>
        <div className='header'>
            <h1>User Roles</h1>
            <div className='user-type-select'>
                <label>
                    <select value={userType} onChange={(e) => setUserType(e.target.value)}>
                        <option value="Staff">Staff</option>
                        <option value="Admin">Admin</option>
                        <option value="Customer">Customer</option>
                    </select>
                </label>
            </div>
            <button className='add-user-btn' onClick={() => openModal()}>
                Add {userType}
            </button>
        </div>
        <table className='user-roles-table'>
            <thead>
                <tr>
                    <th>User Type</th>
                    <th>Full Name</th>
                    <th>Email Address</th>
                    {userType === 'Customer' && <th>Client Type</th>}
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
            {
                accounts.length > 0 ? (
                    accounts.map((account) => (
                    <tr key={account._id}>
                        <td>{userType}</td>
                        <td>{userType === 'Customer' ? `${account.firstName} ${account.middleInitial} ${account.lastName}` : account.fullName}</td>
                        <td>{account.emailAddress}</td>
                            {userType === 'Customer' && <td>{account.clientType}</td>}
                        <td>
                        <button onClick={() => openModal(account)} className='edit-btn'>
                            Edit
                        </button>
                        <button onClick={() => handleDeleteUser(account._id)} className='delete-btn'>
                            Delete
                        </button>
                        </td>
                    </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan={userType === 'Customer' ? 5 : 4}>No {userType} accounts available</td>
                    </tr>
                )
            }
            </tbody>
        </table>

        {
            isUserModalOpen && (
                <div className='modal-overlay'>
                    <div className='modal-content'>
                        <h2>{isEditing ? `Edit ${userType}` : `Add ${userType}`}</h2>
                        <div className='modal-body'>
                            {
                                userType === 'Customer' ? (
                                    <>
                                    <label>
                                        First Name:
                                        <input
                                        type="text"
                                        value={firstName}
                                        onChange={(e) => setFirstName(e.target.value)}
                                        className='user-role-input'
                                        />
                                    </label>
                                    <label>
                                        Middle Name:
                                        <input
                                        type="text"
                                        value={middleInitial}
                                        onChange={(e) => setMiddleInitial(e.target.value)}
                                        className='user-role-input'
                                        />
                                    </label>
                                    <label>
                                        Last Name:
                                        <input
                                        type="text"
                                        value={lastName}
                                        onChange={(e) => setLastName(e.target.value)}
                                        className='user-role-input'
                                        />
                                    </label>
                                    </>
                                ) : (
                                    <label>
                                        Full Name:
                                        <input
                                        type="text"
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        className='user-role-input'
                                        />
                                    </label>
                                )
                            }
                            <label>
                                Email Address:
                                <input
                                type="email"
                                value={emailAddress}
                                onChange={(e) => setEmailAddress(e.target.value)}
                                className='user-role-input'
                                />
                            </label>
                            <label>
                                Contact Number:
                                <input
                                type="text"
                                value={contactNumber}
                                onChange={(e) => setContactNumber(e.target.value)}
                                className='user-role-input'
                                />
                            </label>
                            <label>
                                Password:
                                <input
                                type="text"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className='user-role-input'
                                />
                            </label>
                            {/* {
                                !isEditing && (
                                    <label>
                                        Password:
                                        <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className='user-role-input'
                                        />
                                    </label>
                                )
                            } */}
                            {
                                userType === 'Customer' && (
                                    <label>
                                        Client Type:
                                        <select value={clientType} onChange={(e) => setClientType(e.target.value)}>
                                            <option value="">Select Type</option>
                                            <option value="Individual">Individual</option>
                                            <option value="Wholesaler">Wholesaler</option>
                                        </select>
                                    </label>
                                )
                            }
                        </div>
                        <div className='modal-footer'>
                            <button onClick={handleUserSubmit} className='submit-button'>
                                {isEditing ? 'Update' : 'Submit'}
                            </button>
                            <button onClick={() => setIsUserModalOpen(false)} className='close-button'>
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )
        }
    </div>
  )
}

export default AdminUserRolesComponent
