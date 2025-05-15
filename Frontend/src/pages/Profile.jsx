import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../store/authSlice.mjs';
import { createSelector } from 'reselect';

const selectUser = createSelector(
  (state) => state.auth.userImage,
  (state) => state.auth.userName,
  (userImage, userName) => ({
    profileImage: userImage,
    name: userName,
  })
);

const Profile = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);

  const [profileImage, setProfileImage] = useState(user?.profileImage || 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png');
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [userName, setUserName] = useState(user?.name || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    setProfileImage(user?.profileImage || 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png');
    setUserName(user?.name || '');
  }, [user]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfileImage(imageUrl);
      setProfileImageFile(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (currentPassword || newPassword || repeatPassword) {
      if (!currentPassword || !newPassword || !repeatPassword) {
        Swal.fire({
          icon: 'warning',
          title: 'Validation Error',
          text: 'Please fill all password fields to change your password.'
        });
        return;
      }
      if (newPassword !== repeatPassword) {
        Swal.fire({
          icon: 'warning',
          title: 'Validation Error',
          text: 'New password and repeat password do not match.'
        });
        return;
      }
    }
    try {
      const token = localStorage.getItem('token'); 

      if (profileImageFile) {
        const formData = new FormData();
        formData.append('profileImage', profileImageFile);
        if (userName !== (user?.name || '')) formData.append('userName', userName);
        if (currentPassword) formData.append('currentPassword', currentPassword);
        if (newPassword) formData.append('newPassword', newPassword);

        const response = await axios.put('http://localhost:5000/api/updateprofile', formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });

        if (response.status === 200) {
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Profile updated successfully'
          }).then(() => {
            const token = localStorage.getItem('token');
            const userID = localStorage.getItem('userID');
            const updatedUser = response.data.user;
            dispatch(login({ token, userID, userName: updatedUser.name, userImage: updatedUser.profileImage }));
            navigate('/showalltask');
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to update profile'
          });
        }
      } else {
        const updateData = {};
        if (userName !== (user?.name || '')) updateData.userName = userName;
        if (currentPassword) updateData.currentPassword = currentPassword;
        if (newPassword) updateData.newPassword = newPassword;

        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        };

        const response = await axios.put('http://localhost:5000/api/updateprofile', updateData, config);

        if (response.status === 200) {
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Profile updated successfully'
          }).then(() => {
            const token = localStorage.getItem('token');
            const userID = localStorage.getItem('userID');
            const userImage = user.profileImage; 
            dispatch(login({ token, userID, userName, userImage }));
            navigate('/showalltask');
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to update profile'
          });
        }
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Error updating profile'
      });
    }
  };

  return (
    <>
      <nav style={{ backgroundColor: '#f8f9fa', padding: '10px 20px', borderBottom: '1px solid #ddd' }}>
        <Link to="/showalltask" style={{ textDecoration: 'none', color: '#007bff', fontWeight: 'bold', padding: '5px 10px', borderRadius: '4px', transition: 'background-color 0.3s ease' }}
          onMouseEnter={e => e.currentTarget.style.backgroundColor = '#e0e0e0'}
          onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>
          &larr; Back to Create Task
        </Link>
      </nav>
      <div className="user_profile" style={{ backgroundColor: '#fff', maxWidth: '400px', margin: '40px auto', padding: '30px', border: '1px solid #ddd', borderRadius: '8px', boxShadow: '0 0 10px rgba(0,0,0,0.1)', fontFamily: 'Arial, sans-serif', color: '#333' }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <img
              src={profileImage}
              alt="User Profile"
              id="UserProfileImg"
              style={{ width: '120px', height: '120px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #007bff' }}
            />
            <input
              type="file"
              name="user_profile_photo"
              id="userProfilePhoto"
              onChange={handleImageChange}
              style={{ marginTop: '10px' }}
            />
          </div>

          <label htmlFor="profileUserName" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Username</label>
          <input
            type="text"
            id="profileUserName"
            className="userProfileInput"
            placeholder="Change Username"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            style={{ width: '100%', padding: '10px', marginBottom: '15px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '16px' }}
          />

          <label htmlFor="CurrentPassword" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Current Password</label>
          <input
            type="password"
            id="CurrentPassword"
            className="userProfileInput"
            placeholder="Current Password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            style={{ width: '100%', padding: '10px', marginBottom: '15px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '16px' }}
          />

          <label htmlFor="NewPassword" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>New Password</label>
          <input
            type="password"
            id="NewPassword"
            className="userProfileInput"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            style={{ width: '100%', padding: '10px', marginBottom: '15px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '16px' }}
          />

          <label htmlFor="RepeatPassword" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Repeat Password</label>
          <input
            type="password"
            id="RepeatPassword"
            className="userProfileInput"
            placeholder="Repeat Password"
            value={repeatPassword}
            onChange={(e) => setRepeatPassword(e.target.value)}
            style={{ width: '100%', padding: '10px', marginBottom: '20px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '16px' }}
          />

          <button type="submit" id="userProfileBtn" style={{ width: '100%', padding: '12px', fontSize: '18px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', transition: 'background-color 0.3s ease' }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#0056b3'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = '#007bff'}>
            Update Profile
          </button>
        </form>
      </div>
    </>
  );
};

export default Profile;
