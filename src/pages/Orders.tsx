import React, { useState, useEffect } from 'react';
import { Link, useParams, useLocation } from 'react-router-dom';
import TopBar from '../components/Topbar';
import Sidebar from '../components/Sidebar';

// --- SVG ICONS ---
const SearchIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
);

const CheckCircleIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
    <polyline points="22 4 12 14.01 9 11.01"></polyline>
  </svg>
);

const XIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

// --- MOCK DATA ---
const orders = [
  { id: '12345', date: '2025-06-20', total: 45.99, status: 'Processing', hasDetails: false },
  {
    id: '12346',
    date: '2025-06-18',
    total: 29.50,
    status: 'Dispatched',
    hasDetails: true,
    items: [
      { title: 'The Stardust Thief', author: 'Chelsea Abdullah', quantity: 1, price: 18.99 },
      { title: 'Lessons in Chemistry', author: 'Bonnie Garmus', quantity: 1, price: 10.51 },
    ],
    shippingAddress: {
      name: 'John Doe',
      street: '123 Bookworm Lane',
      city: 'London',
      postalCode: 'W1A 1AA',
      country: 'United Kingdom',
    },
    paymentDetails: {
      method: 'Visa',
      lastFour: '1234',
      expiry: '12/26',
      billingAddress: {
        name: 'John Doe',
        street: '123 Bookworm Lane',
        city: 'London',
        postalCode: 'W1A 1AA',
        country: 'United Kingdom',
      },
    },
    tracking: [
      { status: 'Ordered', date: '2025-06-18T10:00:00Z', location: 'Order placed online', completed: true },
      { status: 'Processing', date: '2025-06-18T12:00:00Z', location: 'Warehouse, London', completed: true },
      { status: 'Dispatched', date: '2025-06-19T09:00:00Z', location: 'London Sorting Facility', completed: true },
      { status: 'In Transit', date: null, location: 'En route to delivery hub', completed: false },
      { status: 'Out for Delivery', date: null, location: 'Local Delivery Hub', completed: false },
      { status: 'Delivered', date: null, location: 'Delivered to address', completed: false },
    ],
  },
  { id: '12347', date: '2025-06-15', total: 60.75, status: 'Delivered', hasDetails: false },
  {
    id: '12348',
    date: '2025-06-12',
    total: 15.99,
    status: 'Delivered',
    hasDetails: true,
    items: [
      { title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', quantity: 1, price: 15.99 },
    ],
    shippingAddress: {
      name: 'Jane Smith',
      street: '456 Reader Road',
      city: 'Manchester',
      postalCode: 'M1 2BB',
      country: 'United Kingdom',
    },
    paymentDetails: {
      method: 'MasterCard',
      lastFour: '5678',
      expiry: '09/25',
      billingAddress: {
        name: 'Jane Smith',
        street: '456 Reader Road',
        city: 'Manchester',
        postalCode: 'M1 2BB',
        country: 'United Kingdom',
      },
    },
    tracking: [
      { status: 'Ordered', date: '2025-06-12T08:00:00Z', location: 'Order placed online', completed: true },
      { status: 'Processing', date: '2025-06-12T10:00:00Z', location: 'Warehouse, Manchester', completed: true },
      { status: 'Dispatched', date: '2025-06-13T07:00:00Z', location: 'Manchester Sorting Facility', completed: true },
      { status: 'In Transit', date: '2025-06-13T14:00:00Z', location: 'En route to delivery hub', completed: true },
      { status: 'Out for Delivery', date: '2025-06-14T09:00:00Z', location: 'Local Delivery Hub', completed: true },
      { status: 'Delivered', date: '2025-06-14T12:30:00Z', location: 'Delivered to address', completed: true },
    ],
  },
  { id: '12349', date: '2025-06-10', total: 89.25, status: 'Processing', hasDetails: false },
  {
    id: '12350',
    date: '2025-06-08',
    total: 32.00,
    status: 'Dispatched',
    hasDetails: true,
    items: [
      { title: '1984', author: 'George Orwell', quantity: 2, price: 16.00 },
    ],
    shippingAddress: {
      name: 'John Doe',
      street: '123 Bookworm Lane',
      city: 'London',
      postalCode: 'W1A 1AA',
      country: 'United Kingdom',
    },
    paymentDetails: {
      method: 'Visa',
      lastFour: '1234',
      expiry: '12/26',
      billingAddress: {
        name: 'John Doe',
        street: '123 Bookworm Lane',
        city: 'London',
        postalCode: 'W1A 1AA',
        country: 'United Kingdom',
      },
    },
    tracking: [
      { status: 'Ordered', date: '2025-06-08T11:00:00Z', location: 'Order placed online', completed: true },
      { status: 'Processing', date: '2025-06-08T13:00:00Z', location: 'Warehouse, London', completed: true },
      { status: 'Dispatched', date: '2025-06-09T08:00:00Z', location: 'London Sorting Facility', completed: true },
      { status: 'In Transit', date: null, location: 'En route to delivery hub', completed: false },
      { status: 'Out for Delivery', date: null, location: 'Local Delivery Hub', completed: false },
      { status: 'Delivered', date: null, location: 'Delivered to address', completed: false },
    ],
  },
  { id: '12351', date: '2025-06-05', total: 55.40, status: 'Processing', hasDetails: false },
  {
    id: '12352',
    date: '2025-06-03',
    total: 22.80,
    status: 'Delivered',
    hasDetails: true,
    items: [
      { title: 'Pride and Prejudice', author: 'Jane Austen', quantity: 1, price: 22.80 },
    ],
    shippingAddress: {
      name: 'Jane Smith',
      street: '456 Reader Road',
      city: 'Manchester',
      postalCode: 'M1 2BB',
      country: 'United Kingdom',
    },
    paymentDetails: {
      method: 'MasterCard',
      lastFour: '5678',
      expiry: '09/25',
      billingAddress: {
        name: 'Jane Smith',
        street: '456 Reader Road',
        city: 'Manchester',
        postalCode: 'M1 2BB',
        country: 'United Kingdom',
      },
    },
    tracking: [
      { status: 'Ordered', date: '2025-06-03T09:00:00Z', location: 'Order placed online', completed: true },
      { status: 'Processing', date: '2025-06-03T11:00:00Z', location: 'Warehouse, Manchester', completed: true },
      { status: 'Dispatched', date: '2025-06-04T06:00:00Z', location: 'Manchester Sorting Facility', completed: true },
      { status: 'In Transit', date: '2025-06-04T15:00:00Z', location: 'En route to delivery hub', completed: true },
      { status: 'Out for Delivery', date: '2025-06-05T08:00:00Z', location: 'Local Delivery Hub', completed: true },
      { status: 'Delivered', date: '2025-06-05T11:45:00Z', location: 'Delivered to address', completed: true },
    ],
  },
];

// --- ItemDetails Component ---
const ItemDetails = () => {
  const { orderId, itemIndex } = useParams();
  const order = orders.find((o) => o.id === orderId);
  const item = order && order.hasDetails && order.items ? order.items[parseInt(itemIndex)] : null;

  if (!order || !order.hasDetails || !item) {
    return (
      <div className="max-w-4xl mx-auto p-4 sm:p-6 text-center">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">Item Not Found</h2>
        <p className="text-sm sm:text-base text-gray-600">No details available for this item.</p>
        <Link
          to="/orders"
          className="mt-4 inline-block bg-blue-600 text-white py-2 px-4 rounded-md text-sm sm:text-base hover:bg-blue-700 transition-colors"
        >
          Back to Orders
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 animate-on-scroll">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6">Item Details - Order #{order.id}</h2>
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm space-y-6 sm:space-y-8">
        <div>
          <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-2">Item Information</h3>
          <div className="text-sm sm:text-base text-gray-600 space-y-2">
            <p><span className="font-medium">Title:</span> {item.title}</p>
            <p><span className="font-medium">Author:</span> {item.author}</p>
            <p><span className="font-medium">Quantity:</span> {item.quantity}</p>
            <p><span className="font-medium">Price:</span> £{item.price.toFixed(2)}</p>
            <p><span className="font-medium">Total:</span> £{(item.price * item.quantity).toFixed(2)}</p>
          </div>
        </div>
        <Link
          to="/orders"
          className="inline-block bg-blue-600 text-white py-2 px-4 rounded-md text-sm sm:text-base hover:bg-blue-700 transition-colors"
        >
          Back to Orders
        </Link>
      </div>
    </div>
  );
};

// --- OrderDetailsSidebar Component ---
const OrderDetailsSidebar = ({ isOpen, onClose }) => {
  const { id } = useParams();
  const order = orders.find((o) => o.id === id);

  if (!order || !order.hasDetails) {
    return (
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-80 bg-white shadow-lg z-50 transform transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="p-3 sm:p-4 border-b flex justify-between items-center">
            <h2 className="text-base sm:text-lg font-bold text-gray-800">Order Not Found</h2>
            <Link to="/orders" onClick={onClose} className="text-gray-600 hover:text-gray-800">
              <XIcon className="w-4 sm:w-5 h-4 sm:h-5" />
            </Link>
          </div>
          <div className="flex-1 p-3 sm:p-4 overflow-y-auto">
            <p className="text-sm sm:text-base text-gray-600">No details available for this order.</p>
            <Link
              to="/orders"
              onClick={onClose}
              className="mt-4 inline-block bg-blue-600 text-white py-2 px-4 rounded-md text-sm sm:text-base hover:bg-blue-700 transition-colors"
            >
              Back to Orders
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const getStatusClass = (status) => {
    switch (status) {
      case 'Processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'Dispatched':
      case 'In Transit':
      case 'Out for Delivery':
        return 'bg-blue-100 text-blue-800';
      case 'Delivered':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div
      className={`fixed top-0 right-0 h-full w-full sm:w-80 bg-white shadow-lg z-50 transform transition-transform duration-300 ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      <div className="flex flex-col h-full">
        <div className="p-3 sm:p-4 border-b flex justify-between items-center">
          <h2 className="text-base sm:text-lg font-bold text-gray-800">Order #{order.id}</h2>
          <Link to="/orders" onClick={onClose} className="text-gray-600 hover:text-gray-800">
            <XIcon className="w-4 sm:w-5 h-4 sm:h-5" />
          </Link>
        </div>
        <div className="flex-1 p-3 sm:p-4 overflow-y-auto">
          <div className="space-y-6 sm:space-y-8">
            {/* Order Summary */}
            <div>
              <h3 className="text-sm sm:text-base font-semibold text-gray-800 mb-2">Order Summary</h3>
              <div className="text-xs sm:text-sm text-gray-600 space-y-2">
                <p><span className="font-medium">Order Date:</span> {new Date(order.date).toLocaleDateString('en-GB')}</p>
                <p><span className="font-medium">Total:</span> £{order.total.toFixed(2)}</p>
                <p>
                  <span className="font-medium">Status:</span>{' '}
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${getStatusClass(order.status)}`}>
                    {order.status}
                  </span>
                </p>
              </div>
            </div>

            {/* Order Items */}
            <div>
              <h3 className="text-sm sm:text-base font-semibold text-gray-800 mb-2">Items</h3>
              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <div key={index} className="flex justify-between items-center border-b pb-2">
                    <div>
                      <p className="text-xs sm:text-sm font-semibold text-gray-800">{item.title}</p>
                      <p className="text-xs text-gray-600">by {item.author}</p>
                      <p className="text-xs text-gray-600">Quantity: {item.quantity}</p>
                    </div>
                    <p className="text-xs sm:text-sm font-semibold text-gray-800">£{(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping Address */}
            <div>
              <h3 className="text-sm sm:text-base font-semibold text-gray-800 mb-2">Shipping Address</h3>
              <p className="text-xs sm:text-sm text-gray-600">
                {order.shippingAddress.name}<br />
                {order.shippingAddress.street}<br />
                {order.shippingAddress.city}, {order.shippingAddress.postalCode}<br />
                {order.shippingAddress.country}
              </p>
            </div>

            {/* Payment Details */}
            <div>
              <h3 className="text-sm sm:text-base font-semibold text-gray-800 mb-2">Payment Details</h3>
              <p className="text-xs sm:text-sm text-gray-600">
                <span className="font-medium">Method:</span> {order.paymentDetails.method} ending in {order.paymentDetails.lastFour}<br />
                <span className="font-medium">Expiry:</span> {order.paymentDetails.expiry}<br />
                <span className="font-medium">Billing Address:</span><br />
                {order.paymentDetails.billingAddress.name}<br />
                {order.paymentDetails.billingAddress.street}<br />
                {order.paymentDetails.billingAddress.city}, {order.paymentDetails.billingAddress.postalCode}<br />
                {order.paymentDetails.billingAddress.country}
              </p>
            </div>

            {/* Shipping Tracker */}
            <div>
              <h3 className="text-sm sm:text-base font-semibold text-gray-800 mb-2">Shipping Tracker</h3>
              <div className="relative pl-6 sm:pl-8">
                <div className="absolute left-2 sm:left-3 top-0 bottom-0 w-0.5 bg-gray-300"></div>
                {order.tracking.map((step, index) => (
                  <div key={index} className="flex items-start mb-4 relative">
                    <div className="absolute left-0 transform -translate-x-1/2">
                      <CheckCircleIcon
                        className={`w-5 h-5 sm:w-6 sm:h-6 ${step.completed ? 'text-green-600' : 'text-gray-400'}`}
                      />
                    </div>
                    <div className="ml-5 sm:ml-6">
                      <p className="text-xs sm:text-sm font-semibold text-gray-800">{step.status}</p>
                      <p className="text-xs text-gray-600">{step.location}</p>
                      <p className="text-xs text-gray-500">
                        {step.date ? new Date(step.date).toLocaleString('en-GB') : 'Pending'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- MainContent Component ---
const MainContent = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortOption, setSortOption] = useState('date-desc');

  // Filter and sort orders
  const filteredOrders = orders
    .filter(
      (order) =>
        order.id.toLowerCase().includes(searchQuery.toLowerCase()) &&
        (statusFilter === 'All' || order.status === statusFilter)
    )
    .sort((a, b) => {
      if (sortOption === 'date-desc') return new Date(b.date).getTime() - new Date(a.date).getTime();
      if (sortOption === 'date-asc') return new Date(a.date).getTime() - new Date(b.date).getTime();
      if (sortOption === 'total-desc') return b.total - a.total;
      if (sortOption === 'total-asc') return a.total - b.total;
      return 0;
    });

  const getStatusClass = (status) => {
    switch (status) {
      case 'Processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'Dispatched':
        return 'bg-blue-100 text-blue-800';
      case 'Delivered':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Helper to format items for display with clickable links to item details
  const formatItems = (items, orderId, hasDetails) => {
    if (!hasDetails || !items || items.length === 0) {
      return <span className="text-gray-600">No items available</span>;
    }
    return items.map((item, index) => (
      <span key={index}>
        <Link
          to={`/item/${orderId}/${index}`}
          className="text-blue-600 hover:underline"
          aria-label={`View details for ${item.title} in order ${orderId}`}
        >
          {item.title} x{item.quantity}
        </Link>
        {index < items.length - 1 && ', '}
      </span>
    ));
  };

  return (
    <main className="flex-1 bg-gray-50 p-4 sm:p-6 lg:p-8 overflow-y-auto min-h-screen pb-16 lg:pb-8">
      <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-gray-800">Your Orders</h1>
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm animate-on-scroll">
        {/* Search and Filter Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-4">
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Search by order number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
            />
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center w-full sm:w-auto space-y-3 sm:space-y-0 sm:space-x-4">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full sm:w-auto p-2 border rounded-md text-sm focus:ring-2 focus:ring-blue-500"
            >
              <option value="All">All Statuses</option>
              <option value="Processing">Processing</option>
              <option value="Dispatched">Dispatched</option>
              <option value="Delivered">Delivered</option>
            </select>
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="w-full sm:w-auto p-2 border rounded-md text-sm focus:ring-2 focus:ring-blue-500"
            >
              <option value="date-desc">Date (Newest First)</option>
              <option value="date-asc">Date (Oldest First)</option>
              <option value="total-desc">Total (High to Low)</option>
              <option value="total-asc">Total (Low to High)</option>
            </select>
          </div>
        </div>

        {/* Orders Table (Desktop) */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b text-gray-500 bg-gray-50">
                <th className="p-3 sm:p-4 font-semibold text-sm sm:text-base">Order Number</th>
                <th className="p-3 sm:p-4 font-semibold text-sm sm:text-base">Date</th>
                <th className="p-3 sm:p-4 font-semibold text-sm sm:text-base">Items</th>
                <th className="p-3 sm:p-4 font-semibold text-sm sm:text-base">Total</th>
                <th className="p-3 sm:p-4 font-semibold text-sm sm:text-base">Status</th>
                <th className="p-3 sm:p-4 font-semibold text-sm sm:text-base">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-4 text-center text-gray-500 text-sm sm:text-base">
                    No orders found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-b last:border-none hover:bg-gray-100 transition-colors"
                  >
                    <td className="p-3 sm:p-4 text-gray-700 text-sm sm:text-base">#{order.id}</td>
                    <td className="p-3 sm:p-4 text-gray-700 text-sm sm:text-base">
                      {new Date(order.date).toLocaleDateString('en-GB')}
                    </td>
                    <td className="p-3 sm:p-4 text-gray-700 text-sm sm:text-base">
                      {formatItems(order.items, order.id, order.hasDetails)}
                    </td>
                    <td className="p-3 sm:p-4 text-gray-700 text-sm sm:text-base">
                      £{order.total.toFixed(2)}
                    </td>
                    <td className="p-3 sm:p-4">
                      <span
                        className={`text-xs sm:text-sm font-semibold px-2 py-1 rounded-full ${getStatusClass(order.status)}`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="p-3 sm:p-4">
                      {order.hasDetails ? (
                        <Link
                          to={`/order/${order.id}`}
                          className="bg-blue-600 text-white px-3 sm:px-4 py-1 sm:py-2 rounded-md font-semibold hover:bg-blue-700 transition-colors text-sm sm:text-base"
                          aria-label={`View details for order ${order.id}`}
                        >
                          View Order Details
                        </Link>
                      ) : (
                        <span className="text-gray-500 italic text-sm sm:text-base">
                          No details available
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Orders Cards (Mobile) */}
        <div className="md:hidden space-y-4">
          {filteredOrders.length === 0 ? (
            <div className="text-center text-gray-500 text-sm">
              No orders found matching your criteria.
            </div>
          ) : (
            filteredOrders.map((order) => (
              <div
                key={order.id}
                className="bg-white border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-semibold text-gray-700">#{order.id}</span>
                  <span
                    className={`text-xs font-semibold px-2 py-1 rounded-full ${getStatusClass(order.status)}`}
                  >
                    {order.status}
                  </span>
                </div>
                <div className="text-sm text-gray-600 mb-1">
                  <span className="font-medium">Date:</span>{' '}
                  {new Date(order.date).toLocaleDateString('en-GB')}
                </div>
                <div className="text-sm text-gray-600 mb-1">
                  <span className="font-medium">Items:</span>{' '}
                  {formatItems(order.items, order.id, order.hasDetails)}
                </div>
                <div className="text-sm text-gray-600 mb-3">
                  <span className="font-medium">Total:</span> £{order.total.toFixed(2)}
                </div>
                <div>
                  {order.hasDetails ? (
                    <Link
                      to={`/order/${order.id}`}
                      className="block text-center bg-blue-600 text-white px-3 py-1 rounded-md font-semibold hover:bg-blue-700 transition-colors text-sm"
                      aria-label={`View details for order ${order.id}`}
                    >
                      View Order Details
                    </Link>
                  ) : (
                    <span className="block text-center text-gray-500 italic text-sm">
                      No details available
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
};

// --- OrdersPage Component ---
const OrdersPage = () => {
  const [activeLink, setActiveLink] = useState('orders');
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const location = useLocation();
  const { id } = useParams();

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

  useEffect(() => {
    setIsDetailsOpen(location.pathname.startsWith('/order/') && !!id);
  }, [location.pathname, id]);

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans flex-col lg:flex-row">
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .fade-in-up { animation: fadeInUp 0.6s ease-out forwards; opacity: 0; }
      `}</style>

      <Sidebar activeLink={activeLink} setActiveLink={setActiveLink} />

      <div className="flex-1 flex flex-col lg:ml-64">
        <TopBar />
        {location.pathname.startsWith('/item/') ? <ItemDetails /> : <MainContent />}
        <OrderDetailsSidebar isOpen={isDetailsOpen} onClose={() => setIsDetailsOpen(false)} />
      </div>
    </div>
  );
};

export default OrdersPage;