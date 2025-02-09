import React, { useContext, useEffect, useRef, useState } from 'react'
import '../../../CSS/AdminCSS/AdminSettings/AdminGeneralComponent.css';
import { useParams } from 'react-router-dom';
import customerDefaultProfilePicture from '../../../assets/icons/customer-default-profile-pciture.png';
import axios from 'axios';
import toast from 'react-hot-toast';
import { AdminContext } from '../../../../contexts/AdminContexts/AdminAuthContext';



function AdminGeneralComponent() {
    const {adminId} = useParams();
    const {admin, setAdmin} = useContext(AdminContext);
    const [formData, setFormData] = useState({
        fullName: '',
        nickName: '',
        gender: 'Other',
        contactNumber: '',
        address: ''
    });
    const [profilePicture, setProfilePicture] = useState(admin?.profilePicture || '');
    const [previewImage, setPreviewImage] = useState('');
    const fileInputRef = useRef(null);

    //pick and display profile picture
    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData(prevData => ({...prevData, [name]: value}));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setProfilePicture(file);
        if(file){
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result);
            };
            reader.readAsDataURL(file);
        } else {
            setPreviewImage('');
        }
    };

    const handleImageClick = () => {
        fileInputRef.current.click();
    };


    //display profile
    useEffect(() => {
        if(!adminId) return;

        axios.get(`/adminAuth/getDataUpdateAdmin/${adminId}`)
            .then(response => {
                const adminData = response.data.admin;

                setProfilePicture(adminData.profilePicture || '');

                setFormData({
                    fullName: adminData.fullName || '',
                    nickName: adminData.nickName || '',
                    gender: adminData.gender || 'Other',
                    contactNumber: adminData.contactNumber || '',
                    address: adminData.address || ''
                });
                setAdmin(adminData);
            })
            .catch(error => console.error(error));
    }, [adminId, setAdmin]);

   

    //update profile
    const handleUpdateProfile = async() => {
        const formDataToSend = new FormData();
        formDataToSend.append('fullName', formData.fullName);
        formDataToSend.append('nickName', formData.nickName);
        formDataToSend.append('gender', formData.gender);
        formDataToSend.append('contactNumber', formData.contactNumber);
        formDataToSend.append('address', formData.address);
        if(profilePicture){
            formDataToSend.append('profilePicture', profilePicture);
        }

        try {
            const response = await axios.post(`/adminAuth/updateProfileAdmin/${adminId}`, formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            const updatedAdmin = response.data.admin;

            setAdmin(updatedAdmin);
            setFormData({
                fullName: updatedAdmin.fullName,
                nickName: updatedAdmin.nickName,
                gender: updatedAdmin.gender,
                contactNumber: updatedAdmin.contactNumber,
                address: updatedAdmin.address
            });
            setProfilePicture(updatedAdmin.profilePicture);
            setPreviewImage('');
            toast.success(response.data.message);
        } catch (error) {
            console.error(error);
            alert('error updating profile: ' + (error.response?.data.message || 'Internal server error'));
        }
    };



    const formatRelativeTime = (timestamp) => {
        const now = new Date();
        const postDate = new Date(timestamp);
        const timeDiff = now - postDate;

        const seconds = Math.floor(timeDiff / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
        const weeks = Math.floor(days / 7);
        const months = Math.floor(days / 30);

        if(months > 0){
            return `${months} month${months > 1 ? 's' : ''} ago`;
        } else if(weeks > 0){
            return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
        } else if(days > 0){
            return `${days} day${days > 1 ? 's' : ''} ago`;
        } else if(hours > 0){
            return `${hours} hr${hours > 1 ? 's' : ''} ago`;
        } else if(minutes > 0){
            return `${minutes} min${minutes > 1 ? 's' : ''} ago`;
        } else{
            return `${seconds} sec${seconds > 1 ? 's' : ''} ago`;
        }
    };

  return (
    <div>
        <div className='admin-profile-container'>
            <div className='admin-profile-header'></div>
            <div className='admin-profile-content'>
                <div className='admin-profile-info'>
                    <img
                    src={previewImage || (profilePicture ? `${profilePicture}` : customerDefaultProfilePicture)}
                    alt="Profile"
                    className='admin-profile-picture'
                    onClick={handleImageClick}
                    />
                    <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    onChange={handleFileChange}
                    />
                    <div className='admin-profile-details'>
                        {
                            !!admin && (
                                <>
                                    <h2>{admin.fullName}</h2>
                                    <p>{admin.emailAddress}</p>
                                </>
                            )
                        }
                    </div>
                </div>
                <button className='save-button-update-profile' onClick={handleUpdateProfile}>Save</button>
            </div>
            
            <div className='admin-profile-fields'>

                <div className='field-group'>
                    <div className='field'>
                        <label>Full Name</label>
                        <input
                        type="text"
                        name='fullName'
                        value={formData.fullName}
                        onChange={handleChange}
                        />
                    </div>
                    <div className='field'>
                        <label>Nick Name</label>
                        <input 
                        type="text" 
                        name='nickName'
                        value={formData.nickName}
                        onChange={handleChange} />
                    </div>
                </div>

                <div className='field-group'>
                    <div className='field'>
                        <label>Gender</label>
                        <select name="gender" value={formData.gender} onChange={handleChange}>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                    <div className='field'>
                        <label>Contact Number</label>
                        <input
                        type="text"
                        name='contactNumber'
                        value={formData.contactNumber}
                        onChange={handleChange}
                        />
                    </div>
                </div>

                <div className='add-contact-number'>
                    <button className='add-contact-button'>+Add Contact Number</button>
                </div>

                <div className='field'>
                    <label>Address</label>
                    <input
                    type="text"
                    name='address'
                    value={formData.address}
                    onChange={handleChange}
                    />
                    {/* <select name="" id="">
                        <option value="Panabo, Davao del Norte">Panabo, Davao del Norte</option>
                        <option value="Carmen, Davao del Norte">Carmen, Davao del Norte</option>
                    </select> */}
                </div>

                <div className='email-section'>
                    <h3>My email Address</h3>
                    <div className='email-info'>
                        <span className='email-icon'></span>
                        {
                            !!admin && (
                                <div>
                                    <p>{admin.emailAddress}</p>
                                    <small>{formatRelativeTime(admin.date)}</small>
                                </div>
                            )
                        }
                    </div>
                    <div className='add-email-address'>
                        <button className='add-email-button'>+Add Email Address</button>
                    </div>
                </div>

            </div>
        </div>
    </div>
  )
}

export default AdminGeneralComponent