"use client";

import React, { useState, useEffect } from 'react';
import TopBar from '../components/Topbar';
import Footer from '../components/footer'; // Assuming Footer is a separate component

// --- SVG ICONS ---
const XIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

const TrashIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"></polyline>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
    <line x1="10" y1="11" x2="10" y2="17"></line>
    <line x1="14" y1="11" x2="14" y2="17"></line>
  </svg>
);

// --- MOCK DATA ---
const initialUserData = {
  name: 'John Doe',
  email: 'john.doe@example.com',
  phone: '',
  profilePicture: 'https://via.placeholder.com/150',
  is2FAEnabled: false,
  notifications: { email: true, sms: false },
};

// --- Account Settings Form Component ---
const AccountSettingsForm = ({ userData, setUserData }) => {
  const [formData, setFormData] = useState({
    ...userData,
    password: '',
    confirmPassword: '',
  });
  const [isModalOpen, setIsModalOpen] = useState(null); // null, 'logout', 'delete'
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [profilePicFile, setProfilePicFile] = useState(null);
  const [profilePicPreview, setProfilePicPreview] = useState(userData.profilePicture);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox' && name.includes('notifications.')) {
      const key = name.split('.')[1];
      setFormData((prev) => ({
        ...prev,
        notifications: { ...prev.notifications, [key]: checked },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    }
  };

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Profile picture must be less than 5MB.');
        return;
      }
      if (!['image/jpeg', 'image/png', 'image/gif'].includes(file.type)) {
        setError('Profile picture must be a JPEG, PNG, or GIF.');
        return;
      }
      setProfilePicFile(file);
      setProfilePicPreview(URL.createObjectURL(file));
      setError('');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (formData.password && formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (formData.phone && !/^\+?\d{10,15}$/.test(formData.phone)) {
      setError('Please enter a valid phone number (10-15 digits).');
      return;
    }

    // Simulate backend API call
    const updatedData = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      profilePicture: profilePicPreview,
      is2FAEnabled: formData.is2FAEnabled,
      notifications: formData.notifications,
      ...(formData.password && { password: formData.password }),
    };
    setUserData(updatedData);
    setSuccess('Account details updated successfully!');
    setFormData((prev) => ({ ...prev, password: '', confirmPassword: '' }));
    // In production: await fetch('/api/user', { method: 'PUT', body: new FormData() with file });
  };

  const handleLogout = () => {
    // Simulate logout
    console.log('User logged out');
    // In production: await fetch('/api/logout', { method: 'POST' }); window.location.href = '/login';
  };

  const handleDeleteAccount = () => {
    // Simulate account deletion
    console.log('Account deleted');
    // In production: await fetch('/api/user', { method: 'DELETE' }); window.location.href = '/login';
  };

  return (
    <div className="max-w-xl mx-auto">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6">Account Settings</h2>
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm animate-on-scroll">
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          <div className="flex flex-col items-center mb-4 sm:mb-6">
            <img
              src={profilePicPreview}
              alt="Profile"
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover mb-2"
            />
            <label className="block text-xs sm:text-sm font-semibold text-gray-800 mb-2">
              Profile Picture
            </label>
            <input
              type="file"
              accept="image/jpeg,image/png,image/gif"
              onChange={handleProfilePicChange}
              className="w-full text-sm sm:text-base text-gray-600"
            />
          </div>
          <div>
            <label className="block text-xs sm:text-sm font-semibold text-gray-800">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Full Name"
              className="w-full p-2 sm:p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 text-sm sm:text-base"
              required
            />
          </div>
          <div>
            <label className="block text-xs sm:text-sm font-semibold text-gray-800">Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email Address"
              className="w-full p-2 sm:p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 text-sm sm:text-base"
              required
            />
          </div>
          <div>
            <label className="block text-xs sm:text-sm font-semibold text-gray-800">Phone Number (Optional)</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+1234567890"
              className="w-full p-2 sm:p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 text-sm sm:text-base"
            />
          </div>
          <div>
            <label className="block text-xs sm:text-sm font-semibold text-gray-800">New Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="New Password"
              className="w-full p-2 sm:p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 text-sm sm:text-base"
            />
          </div>
          <div>
            <label className="block text-xs sm:text-sm font-semibold text-gray-800">Confirm New Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm New Password"
              className="w-full p-2 sm:p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 text-sm sm:text-base"
            />
          </div>
          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                name="is2FAEnabled"
                checked={formData.is2FAEnabled}
                onChange={handleChange}
                className="form-checkbox text-red-600"
              />
              <span className="ml-2 text-xs sm:text-sm text-gray-600">Enable Two-Factor Authentication</span>
            </label>
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-semibold text-gray-800 mb-2">Notification Preferences</h3>
            <label className="flex items-center">
              <input
                type="checkbox"
                name="notifications.email"
                checked={formData.notifications.email}
                onChange={handleChange}
                className="form-checkbox text-red-600"
              />
              <span className="ml-2 text-xs sm:text-sm text-gray-600">Receive email notifications</span>
            </label>
            <label className="flex items-center mt-2">
              <input
                type="checkbox"
                name="notifications.sms"
                checked={formData.notifications.sms}
                onChange={handleChange}
                className="form-checkbox text-red-600"
              />
              <span className="ml-2 text-xs sm:text-sm text-gray-600">Receive SMS notifications</span>
            </label>
          </div>
          {error && <p className="text-xs sm:text-sm text-red-600">{error}</p>}
          {success && <p className="text-xs sm:text-sm text-green-600">{success}</p>}
          <div className="flex justify-between">
            <button
              type="submit"
              className="bg-red-600 text-white py-2 px-3 sm:px-4 rounded-md text-sm sm:text-base hover:bg-red-700 transition-colors"
            >
              Save Changes
            </button>
            <div className="flex space-x-2 sm:space-x-4">
              <button
                type="button"
                onClick={() => setIsModalOpen('logout')}
                className="text-blue-600 text-xs sm:text-sm hover:underline"
              >
                Logout
              </button>
              <button
                type="button"
                onClick={() => setIsModalOpen('delete')}
                className="flex items-center text-xs sm:text-sm text-gray-500 hover:text-red-600"
              >
                <TrashIcon className="w-4 sm:w-5 h-4 sm:h-5 mr-1" /> Delete Account
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Confirmation Modal */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center transition-opacity duration-300 ${
          isModalOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg w-full max-w-sm m-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-base sm:text-lg font-bold text-gray-800">
              {isModalOpen === 'logout' ? 'Confirm Logout' : 'Confirm Delete Account'}
            </h2>
            <button onClick={() => setIsModalOpen(null)} className="text-gray-600 hover:text-gray-800">
              <XIcon className="w-4 sm:w-5 h-4 sm:h-5" />
            </button>
          </div>
          <p className="text-sm sm:text-base text-gray-600 mb-4">
            {isModalOpen === 'logout'
              ? 'Are you sure you want to log out?'
              : 'Are you sure you want to delete your account? This action cannot be undone.'}
          </p>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={() => setIsModalOpen(null)}
              className="py-2 px-3 sm:px-4 rounded-md text-sm sm:text-base text-gray-600 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={isModalOpen === 'logout' ? handleLogout : handleDeleteAccount}
              className="bg-red-600 text-white py-2 px-3 sm:px-4 rounded-md text-sm sm:text-base hover:bg-red-700 transition-colors"
            >
              {isModalOpen === 'logout' ? 'Logout' : 'Delete Account'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Main Account Settings Page Component ---
const AccountSettingsPage = () => {
  const [activeLink, setActiveLink] = useState('account');
  const [userData, setUserData] = useState(initialUserData);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('fade-in-up');
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    const elements = document.querySelectorAll('.animate-on-scroll');
    elements.forEach((el) => observer.observe(el));

    return () => {
      elements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 font-sans flex-col flex">
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .fade-in-up { animation: fadeInUp 0.6s ease-out forwards; opacity: 0; }
      `}</style>

      <TopBar />
      <main className="flex-1 p-4 sm:p-8 overflow-y-auto pb-16">
        <AccountSettingsForm userData={userData} setUserData={setUserData} />
      </main>
      <Footer /> {/* Added Footer at the bottom */}
    </div>
  );
};

export default AccountSettingsPage;