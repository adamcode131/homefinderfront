import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';

export default function AdminProfile(){

  const [user, setUser] = useState({});
  const [image, setImage] = useState(null); 
  const [isEditing, setIsEditing] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    axios.get('http://localhost:8000/api/user', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
    .then(res => {
      setUser(res.data.user);
    })
    .catch(err => console.error(err));
  }, []);

  const handleEditToggle = () => setIsEditing(!isEditing);

  const handleInputChange = (field, value) => {
    setUser(prev => ({ ...prev, [field]: value }));
  };

  const handlePhotoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(file); // save file for upload

      const reader = new FileReader();
      reader.onload = (e) => {
        setUser(prev => ({ ...prev, preview: e.target.result })); // for preview
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => fileInputRef.current?.click();

  const handleSave = () => {
    const formData = new FormData();
    formData.append('name', user.name);
    formData.append('email', user.email);
    formData.append('phone', user.phone);
    if (image) formData.append('image', image);

    axios.post('http://localhost:8000/api/update-profile', formData, {
      headers: { 
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
    .then(res => {
      console.log('Saved:', res.data);
      setIsEditing(false);
      // optionally update user with response
      setUser(res.data.user);
    })
    .catch(err => console.error(err));
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md mx-auto">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Profile</h1>
          <p className="text-gray-600">Manage your personal information</p>
        </div>

        {/* Photo */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            <img 
              src={user.preview || `http://localhost:8000/storage/${user.image}` || '/user.png'}
              alt="Profile" 
              className="w-28 h-28 rounded-full border-4 border-blue-500 shadow-lg object-cover"
            />
            {isEditing && (
              <button 
                className="absolute bottom-0 right-0 bg-blue-500 text-white rounded-full w-10 h-10 flex items-center justify-center"
                onClick={triggerFileInput}
                type="button"
              >
                +
              </button>
            )}
          </div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handlePhotoUpload}
            accept="image/*"
            className="hidden"
          />
        </div>

        {/* Name & Phone */}
        <div className="space-y-6 mb-8">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
            {isEditing ? (
              <input
                type="text"
                value={user.name || ''}
                onChange={e => handleInputChange('name', e.target.value)}
                className="w-full px-4 py-3 border rounded-xl bg-gray-50"
              />
            ) : (
              <div className="w-full px-4 py-3 border rounded-xl bg-gray-50">{user.name}</div>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            {isEditing ? (
              <input
                type="email"
                value={user.email || ''}
                onChange={e => handleInputChange('email', e.target.value)}
                className="w-full px-4 py-3 border rounded-xl bg-gray-50"
              />
            ) : (
              <div className="w-full px-4 py-3 border rounded-xl bg-gray-50">{user.email}</div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
            {isEditing ? (
              <input
                type="tel"
                value={user.phone || ''}
                onChange={e => handleInputChange('phone', e.target.value)}
                className="w-full px-4 py-3 border rounded-xl bg-gray-50"
              />
            ) : (
              <div className="w-full px-4 py-3 border rounded-xl bg-gray-50">{user.phone}</div>
            )}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-center gap-4">
          {!isEditing ? (
            <button onClick={handleEditToggle} className="bg-blue-500 text-white py-3 px-8 rounded-xl">Edit Profile</button>
          ) : (
            <>
              <button onClick={handleSave} className="bg-blue-500 text-white py-3 px-8 rounded-xl">Save Changes</button>
              <button onClick={handleEditToggle} className="bg-gray-500 text-white py-3 px-8 rounded-xl">Cancel</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
