"use client";

import React, { useState, useEffect } from 'react';
import TopBar from '../components/Topbar';
import Footer from '../components/footer'; // Added Footer import

// --- SVG ICONS ---
const TrashIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"></polyline>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
    <line x1="10" y1="11" x2="10" y2="17"></line>
    <line x1="14" y1="11" x2="14" y2="17"></line>
  </svg>
);

const XIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

// --- MOCK DATA ---
const initialAddresses = [
  {
    id: 1,
    name: 'John Doe',
    street: '123 Bookworm Lane',
    city: 'London',
    postalCode: 'W1A 1AA',
    country: 'United Kingdom',
    isDefault: true,
  },
  {
    id: 2,
    name: 'Jane Smith',
    street: '456 Reader Road',
    city: 'Manchester',
    postalCode: 'M1 2BB',
    country: 'United Kingdom',
    isDefault: false,
  },
];

// --- Address Form Modal Component ---
const AddressFormModal = ({ isOpen, onClose, onSubmit, initialData = {} }) => {
  const [formData, setFormData] = useState({
    name: initialData.name || '',
    street: initialData.street || '',
    city: initialData.city || '',
    postalCode: initialData.postalCode || '',
    country: initialData.country || '',
    isDefault: initialData.isDefault || false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  return (
    <div
      className={`fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center transition-opacity duration-300 ${
        isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
    >
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg w-full max-w-md m-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-base sm:text-lg font-bold text-gray-800">
            {initialData.id ? 'Edit Address' : 'Add New Address'}
          </h2>
          <button onClick={onClose} className="text-gray-600 hover:text-gray-800">
            <XIcon className="w-4 sm:w-5 h-4 sm:h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
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
            <label className="block text-xs sm:text-sm font-semibold text-gray-800">Street Address</label>
            <input
              type="text"
              name="street"
              value={formData.street}
              onChange={handleChange}
              placeholder="Street Address"
              className="w-full p-2 sm:p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 text-sm sm:text-base"
              required
            />
          </div>
          <div>
            <label className="block text-xs sm:text-sm font-semibold text-gray-800">City</label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder="City"
              className="w-full p-2 sm:p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 text-sm sm:text-base"
              required
            />
          </div>
          <div>
            <label className="block text-xs sm:text-sm font-semibold text-gray-800">Postal Code</label>
            <input
              type="text"
              name="postalCode"
              value={formData.postalCode}
              onChange={handleChange}
              placeholder="Postal Code"
              className="w-full p-2 sm:p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 text-sm sm:text-base"
              required
            />
          </div>
          <div>
            <label className="block text-xs sm:text-sm font-semibold text-gray-800">Country</label>
            <input
              type="text"
              name="country"
              value={formData.country}
              onChange={handleChange}
              placeholder="Country"
              className="w-full p-2 sm:p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 text-sm sm:text-base"
              required
            />
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              name="isDefault"
              checked={formData.isDefault}
              onChange={handleChange}
              className="form-checkbox text-red-600"
            />
            <span className="ml-2 text-xs sm:text-sm text-gray-600">Set as default address</span>
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="py-2 px-3 sm:px-4 rounded-md text-sm sm:text-base text-gray-600 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-red-600 text-white py-2 px-3 sm:px-4 rounded-md text-sm sm:text-base hover:bg-red-700 transition-colors"
            >
              Save Address
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// --- Addresses Component ---
const Addresses = ({ addresses, setAddresses }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);

  const handleAddAddress = (formData) => {
    const newAddress = {
      id: addresses.length + 1,
      ...formData,
      isDefault: formData.isDefault || addresses.length === 0,
    };
    if (newAddress.isDefault) {
      setAddresses((prev) =>
        prev.map((addr) => ({ ...addr, isDefault: false })).concat(newAddress)
      );
    } else {
      setAddresses((prev) => [...prev, newAddress]);
    }
  };

  const handleEditAddress = (formData) => {
    const updatedAddresses = addresses.map((addr) =>
      addr.id === editingAddress.id
        ? { ...formData, id: editingAddress.id, isDefault: formData.isDefault }
        : { ...addr, isDefault: formData.isDefault ? false : addr.isDefault }
    );
    setAddresses(updatedAddresses);
  };

  const handleRemoveAddress = (id) => {
    setAddresses(addresses.filter((addr) => addr.id !== id));
  };

  const openEditModal = (address) => {
    setEditingAddress(address);
    setIsModalOpen(true);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-4 sm:mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800">My Addresses</h2>
        <button
          onClick={() => {
            setEditingAddress(null);
            setIsModalOpen(true);
          }}
          className="bg-red-600 text-white py-2 px-3 sm:px-4 rounded-md text-sm sm:text-base hover:bg-red-700 transition-colors"
        >
          Add New Address
        </button>
      </div>
      {addresses.length === 0 ? (
        <div className="text-center py-8 sm:py-12 animate-on-scroll">
          <p className="text-base sm:text-lg text-gray-600">No addresses saved.</p>
          <p className="text-sm sm:text-base text-gray-500 mt-2">Add an address to make checkout faster!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 animate-on-scroll">
          {addresses.map((address) => (
            <div key={address.id} className="bg-white p-3 sm:p-4 rounded-lg shadow-sm">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold text-base sm:text-lg text-gray-800">{address.name}</p>
                  <p className="text-xs sm:text-sm text-gray-600">
                    {address.street}<br />
                    {address.city}, {address.postalCode}<br />
                    {address.country}
                  </p>
                  {address.isDefault && (
                    <p className="text-xs sm:text-sm text-red-600 font-semibold mt-2">Default Address</p>
                  )}
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => openEditModal(address)}
                    className="text-blue-600 text-xs sm:text-sm hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleRemoveAddress(address.id)}
                    className="flex items-center text-xs sm:text-sm text-gray-500 hover:text-red-600"
                  >
                    <TrashIcon className="w-4 sm:w-5 h-4 sm:h-5 mr-1" /> Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      <AddressFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={editingAddress ? handleEditAddress : handleAddAddress}
        initialData={editingAddress || {}}
      />
    </div>
  );
};

// --- Main Addresses Page Component ---
const AddressesPage = () => {
  const [addresses, setAddresses] = useState(initialAddresses);

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
    <div className="flex min-h-screen bg-gray-50 font-sans flex-col">
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .fade-in-up { animation: fadeInUp 0.6s ease-out forwards; opacity: 0; }
      `}</style>

      <TopBar />
      <main className="flex-1 p-4 sm:p-8 overflow-y-auto pb-16 lg:pb-8">
        <Addresses addresses={addresses} setAddresses={setAddresses} />
      </main>
      <Footer /> {/* Added Footer component */}
    </div>
  );
};

export default AddressesPage;