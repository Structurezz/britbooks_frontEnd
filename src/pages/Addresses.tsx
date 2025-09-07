import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TopBar from '../components/Topbar';
import Footer from '../components/footer';
import { useAuth } from '../context/authContext';
import { jwtDecode } from 'jwt-decode';
import axios, { AxiosError } from 'axios';
import { TrashIcon, XIcon } from '../components/icons';

// --- Address Form Modal Component ---
const AddressFormModal = ({ isOpen, onClose, onSubmit, initialData = {} }) => {
  const [formData, setFormData] = useState({
    fullName: initialData.fullName || "",
    phoneNumber: initialData.phoneNumber || "",
    addressLine1: initialData.addressLine1 || "",
    addressLine2: initialData.addressLine2 || "",
    city: initialData.city || "",
    state: initialData.state || "",
    postalCode: initialData.postalCode || "",
    country: initialData.country || "GB",
    isDefault: initialData.isDefault || false,
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    const newErrors: any = {};
    if (!formData.fullName.trim()) newErrors.fullName = "Full Name is required";
    if (!formData.phoneNumber.trim()) newErrors.phoneNumber = "Phone Number is required";
    else if (!/^\+?\d{10,15}$/.test(formData.phoneNumber.replace(/\s/g, "")))
      newErrors.phoneNumber = "Invalid phone number";
    if (!formData.addressLine1.trim()) newErrors.addressLine1 = "Address Line 1 is required";
    if (!formData.city.trim()) newErrors.city = "City is required";
    if (!formData.postalCode.trim()) newErrors.postalCode = "Postal Code is required";
    else if (!/^[A-Z0-9\s]{5,10}$/i.test(formData.postalCode.replace(/\s/g, "")))
      newErrors.postalCode = "Invalid postal code";
    if (!formData.country.trim()) newErrors.country = "Country is required";
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      await onSubmit(formData);
      onClose();
    } catch (err) {
      setErrors({ form: "Failed to save address. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center transition-opacity duration-300 ${
        isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      {/* Modal container */}
      <div className="bg-white rounded-lg shadow-lg w-full max-w-lg lg:max-w-2xl m-4 sm:m-6 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-gray-200 flex justify-between items-center shrink-0">
          <h2 className="text-lg sm:text-xl font-bold text-gray-800">
            {initialData._id ? "Edit Address" : "Add New Address"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-800"
            aria-label="Close modal"
          >
            <XIcon className="w-5 h-5" />
          </button>
        </div>
  
        {/* Scrollable Body */}
        <form
          onSubmit={handleSubmit}
          className="p-4 sm:p-6 space-y-4 overflow-y-auto flex-1"
        >
          {errors.form && (
            <div className="text-red-500 text-sm mb-4">{errors.form}</div>
          )}
  
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            placeholder="Full Name"
            className={`w-full p-3 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-red-500 ${
              errors.fullName ? "border-red-500" : "border-gray-300"
            }`}
            required
          />
  
          <input
            type="tel"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            placeholder="Phone Number"
            className={`w-full p-3 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-red-500 ${
              errors.phoneNumber ? "border-red-500" : "border-gray-300"
            }`}
            required
          />
  
          <input
            type="text"
            name="addressLine1"
            value={formData.addressLine1}
            onChange={handleChange}
            placeholder="Address Line 1"
            className={`w-full p-3 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-red-500 ${
              errors.addressLine1 ? "border-red-500" : "border-gray-300"
            }`}
            required
          />
  
          <input
            type="text"
            name="addressLine2"
            value={formData.addressLine2}
            onChange={handleChange}
            placeholder="Address Line 2 (Optional)"
            className="w-full p-3 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
          />
  
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            placeholder="City"
            className={`w-full p-3 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-red-500 ${
              errors.city ? "border-red-500" : "border-gray-300"
            }`}
            required
          />
  
          <input
            type="text"
            name="state"
            value={formData.state}
            onChange={handleChange}
            placeholder="State (Optional)"
            className="w-full p-3 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
          />
  
          <input
            type="text"
            name="postalCode"
            value={formData.postalCode}
            onChange={handleChange}
            placeholder="Postal Code"
            className={`w-full p-3 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-red-500 ${
              errors.postalCode ? "border-red-500" : "border-gray-300"
            }`}
            required
          />
  
          <input
            type="text"
            name="country"
            value={formData.country}
            onChange={handleChange}
            placeholder="Country"
            className={`w-full p-3 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-red-500 ${
              errors.country ? "border-red-500" : "border-gray-300"
            }`}
            required
          />
  
          {/* Default Address Checkbox */}
          <div className="flex items-center">
            <input
              type="checkbox"
              name="isDefault"
              checked={formData.isDefault}
              onChange={handleChange}
              className="form-checkbox text-red-600 h-4 w-4"
              id="isDefault"
            />
            <label htmlFor="isDefault" className="ml-2 text-sm text-gray-600">
              Set as default address
            </label>
          </div>
        </form>
  
        {/* Footer */}
        <div className="p-4 sm:p-6 border-t border-gray-200 flex justify-end space-x-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="py-2 px-4 rounded-md text-sm text-gray-600 hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            className="py-2 px-4 bg-red-600 text-white rounded-md text-sm hover:bg-red-700 transition-colors disabled:bg-red-400"
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Address"}
          </button>
        </div>
      </div>
    </div>
  );
  
  
};

// --- Addresses Component ---
interface Address {
  _id: string;
  fullName: string;
  phoneNumber: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state?: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

interface AddressesProps {
  addresses: Address[];
  setAddresses: React.Dispatch<React.SetStateAction<Address[]>>;
  authToken: string | null;
  userId: string | null;
  navigate: ReturnType<typeof useNavigate>;
  onSelectAddress?: (address: Address) => void;
  selectedAddressId?: string | null;
}

const Addresses: React.FC<AddressesProps> = ({ addresses, setAddresses, authToken, userId, navigate, onSelectAddress, selectedAddressId }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [error, setError] = useState<string | null>(null);

  const API_BASE_URL = "https://britbooks-api-production.up.railway.app/api";

  const handleAddAddress = async (formData: Address) => {
    try {
      const newAddress = {
        ...formData,
        isDefault: formData.isDefault || addresses.length === 0,
      };
      const response = await axios.post(
        `${API_BASE_URL}/users/${userId}/address`,
        newAddress,
        { headers: { Authorization: `Bearer ${authToken}` } }
      );
      const updatedAddresses = newAddress.isDefault
        ? addresses.map((addr) => ({ ...addr, isDefault: false })).concat({ ...response.data, isDefault: true })
        : [...addresses, response.data];
      setAddresses(updatedAddresses);
      if (onSelectAddress) {
        onSelectAddress(response.data);
      }
      setError(null);
    } catch (err: AxiosError) {
      console.error("Add address error:", err);
      if (err.response?.status === 401) {
        setError("Session expired. Please log in again.");
        navigate("/login");
      } else {
        setError("Failed to add address. Please try again.");
      }
    }
  };

  const handleEditAddress = async (formData: Address) => {
    try {
      const updatedAddress = { ...formData, _id: editingAddress!._id };
      const response = await axios.put(
        `${API_BASE_URL}/users/${userId}/address/${editingAddress!._id}`,
        updatedAddress,
        { headers: { Authorization: `Bearer ${authToken}` } }
      );
      const updatedAddresses = addresses.map((addr) =>
        addr._id === editingAddress!._id
          ? { ...response.data, isDefault: formData.isDefault }
          : { ...addr, isDefault: formData.isDefault ? false : addr.isDefault }
      );
      setAddresses(updatedAddresses);
      if (onSelectAddress && updatedAddress._id === selectedAddressId) {
        onSelectAddress(response.data);
      }
      setError(null);
    } catch (err: AxiosError) {
      console.error("Edit address error:", err);
      if (err.response?.status === 401) {
        setError("Session expired. Please log in again.");
        navigate("/login");
      } else {
        setError("Failed to update address. Please try again.");
      }
    }
  };

  const handleRemoveAddress = async (id: string) => {
    try {
      await axios.delete(`${API_BASE_URL}/users/${userId}/address/${id}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      const updatedAddresses = addresses.filter((addr) => addr._id !== id);
      setAddresses(updatedAddresses);
      if (selectedAddressId === id && onSelectAddress && updatedAddresses.length > 0) {
        onSelectAddress(updatedAddresses[0]);
      }
      setError(null);
    } catch (err: AxiosError) {
      console.error("Remove address error:", err);
      if (err.response?.status === 401) {
        setError("Session expired. Please log in again.");
        navigate("/login");
      } else {
        setError("Failed to remove address. Please try again.");
      }
    }
  };

  const openEditModal = (address: Address) => {
    setEditingAddress(address);
    setIsModalOpen(true);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-4 sm:mb-6">
        <h2 className="text-lg sm:text-xl font-bold text-gray-800">Select Shipping Address</h2>
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
      {error && <div className="text-red-500 text-sm mb-4">{error}</div>}
      {addresses.length === 0 ? (
        <div className="text-center py-8 sm:py-12 animate-on-scroll">
          <p className="text-base sm:text-lg text-gray-600">No addresses saved.</p>
          <p className="text-sm sm:text-base text-gray-500 mt-2">Add an address to continue with checkout.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 animate-on-scroll">
          {addresses.map((address) => (
            <div
              key={address._id}
              className={`bg-white p-3 sm:p-4 rounded-lg shadow-sm border-2 transition-all duration-200 ${
                selectedAddressId === address._id ? "border-red-600" : "border-transparent hover:border-gray-200"
              }`}
              onClick={() => onSelectAddress && onSelectAddress(address)}
            >
              <div className="flex justify-between items-start">
                <div className="flex items-start gap-2">
                  {onSelectAddress && (
                    <input
                      type="radio"
                      checked={selectedAddressId === address._id}
                      onChange={() => onSelectAddress(address)}
                      className="form-radio text-red-600 mt-1"
                    />
                  )}
                  <div>
                    <p className="font-semibold text-base sm:text-lg text-gray-800">{address.fullName}</p>
                    <p className="text-xs sm:text-sm text-gray-600">
                      {address.addressLine1}
                      {address.addressLine2 && `, ${address.addressLine2}`}
                      <br />
                      {address.city}, {address.postalCode}
                      <br />
                      {address.country}
                      <br />
                      {address.phoneNumber}
                    </p>
                    {address.isDefault && (
                      <p className="text-xs sm:text-sm text-red-600 font-semibold mt-2">Default Address</p>
                    )}
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openEditModal(address);
                    }}
                    className="text-blue-600 text-xs sm:text-sm hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveAddress(address._id);
                    }}
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
  const { auth, logout } = useAuth();
  const navigate = useNavigate();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [error, setError] = useState<string | null>(null);
  const API_BASE_URL = "https://britbooks-api-production.up.railway.app/api";

  const userId = auth.token ? jwtDecode<{ userId: string }>(auth.token).userId : null;

  useEffect(() => {
    const fetchAddresses = async () => {
      if (!auth.token || !userId) {
        setError("Please log in to view addresses.");
        navigate("/login");
        return;
      }
      try {
        const response = await axios.get(`${API_BASE_URL}/users/${userId}/address`, {
          headers: { Authorization: `Bearer ${auth.token}` },
        });
        setAddresses(response.data.addresses || []);
        setError(null);
      } catch (err: AxiosError) {
        console.error("Fetch addresses error:", err);
        if (err.response?.status === 401) {
          setError("Session expired. Please log in again.");
          logout();
          navigate("/login");
        } else {
          setError("Failed to load addresses. Please try again.");
        }
      }
    };
    fetchAddresses();
  }, [auth.token, userId, navigate, logout]);

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
      <TopBar />
      <main className="flex-1 p-4 sm:p-8 overflow-y-auto pb-16 lg:pb-8">
        {error && <div className="text-red-500 text-sm mb-4 text-center">{error}</div>}
        <Addresses addresses={addresses} setAddresses={setAddresses} authToken={auth.token} userId={userId} navigate={navigate} />
      </main>
      <Footer />
    </div>
  );
};

export { Addresses, AddressFormModal };
export default AddressesPage;