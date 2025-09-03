import React, { useState, useEffect } from 'react';
import { Link, useParams, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/authContext';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import TopBar from '../components/Topbar';
import Footer from '../components/footer';

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

const API_BASE_URL = 'https://britbooks-api-production.up.railway.app/api';

// --- ItemDetails Component ---
const ItemDetails = ({ orders }) => {
  const { orderId, itemIndex } = useParams();
  const order = orders.find((o) => o.id === orderId);
  const item = order && order.hasDetails && order.items ? order.items[parseInt(itemIndex)] : null;

  if (!order || !order.hasDetails || !item) {
    return (
      <div className="max-w-3xl mx-auto p-4 sm:p-6 lg:p-8 animate-fade-in">
        <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-6">Item Not Found</h2>
        <div className="bg-white rounded-xl shadow-sm p-6 text-center">
          <p className="text-gray-600 mb-6">No details available for this item.</p>
          <Link
            to="/orders"
            className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200 font-medium"
          >
            Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-6 lg:p-8 animate-fade-in">
      <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-6">Item Details - Order #{order.id}</h2>
      <div className="bg-white rounded-xl shadow-sm p-6 space-y-8">
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Item Information</h3>
          <div className="text-gray-600 space-y-3">
            <p><span className="font-medium">Title:</span> {item.title}</p>
            <p><span className="font-medium">Quantity:</span> {item.quantity}</p>
            <p><span className="font-medium">Price:</span> £{item.price.toFixed(2)}</p>
            <p><span className="font-medium">Total:</span> £{(item.price * item.quantity).toFixed(2)}</p>
          </div>
        </div>
        <Link
          to="/orders"
          className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200 font-medium"
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
  const { auth, logout } = useAuth();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isOpen || !id) return;

    const fetchOrderDetails = async () => {
      if (!auth.token) {
        console.error('No auth token. Redirecting to login.');
        navigate('/login');
        return;
      }

      try {
        const response = await axios.get(`${API_BASE_URL}/orders/${id}`, {
          headers: { Authorization: `Bearer ${auth.token}` },
        });

        if (response.data.success && response.data.order) {
          const fetchedOrder = response.data.order;
          const now = new Date();
          const orderDate = new Date(fetchedOrder.createdAt);
          const oneMinuteAfterOrder = new Date(orderDate.getTime() + 60 * 1000);
          const isProcessingCompleted = now >= oneMinuteAfterOrder;
          const isConfirmedOrCompleted = fetchedOrder.status.toLowerCase() === 'confirmed' || fetchedOrder.status.toLowerCase() === 'completed';

          const mappedOrder = {
            id: fetchedOrder._id,
            date: fetchedOrder.createdAt,
            total: fetchedOrder.total,
            status: fetchedOrder.status.charAt(0).toUpperCase() + fetchedOrder.status.slice(1),
            hasDetails: fetchedOrder.items.length > 0,
            items: fetchedOrder.items.map((item) => ({
              title: item.title || 'Unknown Item',
              quantity: item.quantity,
              priceAtPurchase: item.priceAtPurchase,
              author: item.author || 'Unknown',
            })),
            shippingAddress: {
              name: fetchedOrder.shippingAddress.fullName,
              street: fetchedOrder.shippingAddress.addressLine1,
              city: fetchedOrder.shippingAddress.city,
              postalCode: fetchedOrder.shippingAddress.postalCode,
              country: fetchedOrder.shippingAddress.country,
            },
            paymentDetails: {
              method: fetchedOrder.payment.method.charAt(0).toUpperCase() + fetchedOrder.payment.method.slice(1),
              status: 'Paid', // Hardcode as Paid since order is placed
            },
            tracking: [
              { status: 'Ordered', date: fetchedOrder.createdAt, location: 'Order placed online', completed: true },
              {
                status: 'Processing',
                date: isProcessingCompleted ? new Date(orderDate.getTime() + 60 * 1000).toISOString() : null,
                location: 'Warehouse',
                completed: isProcessingCompleted,
              },
              {
                status: 'Dispatched',
                date: isConfirmedOrCompleted ? new Date(orderDate.getTime() + 2 * 60 * 1000).toISOString() : null,
                location: 'Sorting Facility',
                completed: isConfirmedOrCompleted,
              },
              {
                status: 'In Transit',
                date: isConfirmedOrCompleted ? new Date(orderDate.getTime() + 3 * 60 * 1000).toISOString() : null,
                location: 'En route to delivery hub',
                completed: isConfirmedOrCompleted,
              },
              { status: 'Out for Delivery', date: null, location: 'Local Delivery Hub', completed: false },
              {
                status: 'Delivered',
                date: fetchedOrder.status.toLowerCase() === 'completed' ? new Date(orderDate.getTime() + 4 * 60 * 1000).toISOString() : null,
                location: 'Delivered to address',
                completed: fetchedOrder.status.toLowerCase() === 'completed',
              },
            ],
          };
          setOrder(mappedOrder);
          console.log('Order details loaded successfully.');
        } else {
          console.error('Failed to load order details.');
        }
      } catch (err) {
        console.error('Fetch order details error:', err);
        if (err.response?.status === 401) {
          console.error('Session expired. Redirecting to login.');
          logout();
          navigate('/login');
        } else {
          console.error('Failed to load order details. Please try again.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [isOpen, id, auth.token, navigate, logout]);

  if (loading) {
    return (
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-96 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">Loading...</h2>
            <Link to="/orders" onClick={onClose} className="text-gray-500 hover:text-gray-700 transition-colors">
              <XIcon className="w-6 h-6" />
            </Link>
          </div>
          <div className="flex-1 p-6 overflow-y-auto">
            <p className="text-gray-600">Loading order details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!order || !order.hasDetails) {
    return (
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-96 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">Order Not Found</h2>
            <Link to="/orders" onClick={onClose} className="text-gray-500 hover:text-gray-700 transition-colors">
              <XIcon className="w-6 h-6" />
            </Link>
          </div>
          <div className="flex-1 p-6 overflow-y-auto">
            <p className="text-gray-600 mb-6">No details available for this order.</p>
            <Link
              to="/orders"
              onClick={onClose}
              className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200 font-medium"
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
      case 'Pending':
        return 'bg-amber-100 text-amber-800';
      case 'Confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'Completed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div
      className={`fixed top-0 right-0 h-full w-full sm:w-96 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      <div className="flex flex-col h-full">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">Order #{order.id}</h2>
          <Link to="/orders" onClick={onClose} className="text-gray-500 hover:text-gray-700 transition-colors">
            <XIcon className="w-6 h-6" />
          </Link>
        </div>
        <div className="flex-1 p-6 overflow-y-auto space-y-8">
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h3>
            <div className="text-gray-600 space-y-3">
              <p><span className="font-medium">Order Date:</span> {new Date(order.date).toLocaleDateString('en-GB')}</p>
              <p><span className="font-medium">Total:</span> £{order.total.toFixed(2)}</p>
              <p>
                <span className="font-medium">Status:</span>{' '}
                <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${getStatusClass(order.status)}`}>
                  {order.status}
                </span>
              </p>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Items</h3>
            <div className="space-y-4">
              {order.items.map((item, index) => (
                <div key={index} className="flex justify-between items-center border-b border-gray-200 pb-4">
                  <div>
                    <p className="text-gray-900 font-medium">{item.title}</p>
                    <p className="text-sm text-gray-500">Author: {item.author}</p>
                    <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                  </div>
                  <p className="text-gray-900 font-medium">£{(item.priceAtPurchase * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Shipping Address</h3>
            <p className="text-gray-600">
              {order.shippingAddress.name}<br />
              {order.shippingAddress.street}<br />
              {order.shippingAddress.city}, {order.shippingAddress.postalCode}<br />
              {order.shippingAddress.country}
            </p>
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Payment Details</h3>
            <p className="text-gray-600">
              <span className="font-medium">Method:</span> {order.paymentDetails.method}<br />
              <span className="font-medium">Status:</span> {order.paymentDetails.status}
            </p>
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Shipping Tracker</h3>
            <div className="relative pl-8">
              <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-gray-200"></div>
              {order.tracking.map((step, index) => (
                <div key={index} className="flex items-start mb-6 relative">
                  <div className="absolute left-0 transform -translate-x-1/2">
                    <CheckCircleIcon
                      className={`w-6 h-6 ${step.completed ? 'text-green-600' : 'text-gray-400'}`}
                    />
                  </div>
                  <div className="ml-6">
                    <p className="text-gray-900 font-medium">{step.status}</p>
                    <p className="text-sm text-gray-500">{step.location}</p>
                    <p className="text-sm text-gray-400">
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
  );
};

// --- MainContent Component ---
const MainContent = ({ setOrders }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [orders, setLocalOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalOrders, setTotalOrders] = useState(0);
  const ordersPerPage = 20; // Match backend default limit
  const { auth, logout } = useAuth();
  const navigate = useNavigate();

  // Fetch orders from API with pagination
  useEffect(() => {
    const fetchOrders = async () => {
      if (!auth.token) {
        console.error('No auth token. Redirecting to login.');
        navigate('/login');
        return;
      }

      try {
        const decoded = jwtDecode(auth.token);
        const userId = decoded.userId;
        const queryParams = new URLSearchParams({
          page: currentPage,
          limit: ordersPerPage,
          ...(statusFilter !== 'All' && { status: statusFilter.toLowerCase() }),
        });

        const response = await axios.get(
          `${API_BASE_URL}/orders/user/${userId}?${queryParams.toString()}`,
          {
            headers: { Authorization: `Bearer ${auth.token}` },
          }
        );

        if (response.data.success) {
          const fetchedOrders = response.data.orders;
          const mappedOrders = fetchedOrders.map((order) => {
            const now = new Date();
            const orderDate = new Date(order.createdAt);
            const oneMinuteAfterOrder = new Date(orderDate.getTime() + 60 * 1000);
            const isProcessingCompleted = now >= oneMinuteAfterOrder;
            const isConfirmedOrCompleted = order.status.toLowerCase() === 'confirmed' || order.status.toLowerCase() === 'completed';

            return {
              id: order._id,
              date: order.createdAt,
              total: order.total,
              status: order.status.charAt(0).toUpperCase() + order.status.slice(1),
              hasDetails: order.items.length > 0,
              items: order.items.map((item) => ({
                title: item.listing?.title || 'Unknown Item',
                quantity: item.quantity,
                price: item.priceAtPurchase,
              })),
              shippingAddress: {
                name: order.shippingAddress.fullName,
                street: order.shippingAddress.addressLine1,
                city: order.shippingAddress.city,
                postalCode: order.shippingAddress.postalCode,
                country: order.shippingAddress.country,
              },
              paymentDetails: {
                method: order.payment.method.charAt(0).toUpperCase() + order.payment.method.slice(1),
                status: 'Paid',
              },
              tracking: [
                { status: 'Ordered', date: order.createdAt, location: 'Order placed online', completed: true },
                {
                  status: 'Processing',
                  date: isProcessingCompleted ? new Date(orderDate.getTime() + 60 * 1000).toISOString() : null,
                  location: 'Warehouse',
                  completed: isProcessingCompleted,
                },
                {
                  status: 'Dispatched',
                  date: isConfirmedOrCompleted ? new Date(orderDate.getTime() + 2 * 60 * 1000).toISOString() : null,
                  location: 'Sorting Facility',
                  completed: isConfirmedOrCompleted,
                },
                {
                  status: 'In Transit',
                  date: isConfirmedOrCompleted ? new Date(orderDate.getTime() + 3 * 60 * 1000).toISOString() : null,
                  location: 'En route to delivery hub',
                  completed: isConfirmedOrCompleted,
                },
                { status: 'Out for Delivery', date: null, location: 'Local Delivery Hub', completed: false },
                {
                  status: 'Delivered',
                  date: order.status.toLowerCase() === 'completed' ? new Date(orderDate.getTime() + 4 * 60 * 1000).toISOString() : null,
                  location: 'Delivered to address',
                  completed: order.status.toLowerCase() === 'completed',
                },
              ],
            };
          });

          setLocalOrders(mappedOrders);
          setOrders(mappedOrders);
          setTotalPages(response.data.pagination.pages);
          setTotalOrders(response.data.pagination.total);
          console.log('Orders loaded successfully:', response.data.pagination);
        } else {
          console.error('Failed to load orders.');
        }
      } catch (err) {
        console.error('Fetch orders error:', err);
        if (err.response?.status === 401) {
          console.error('Session expired. Redirecting to login.');
          logout();
          navigate('/login');
        } else if (err.response?.status === 403) {
          console.error('Forbidden access.');
          navigate('/orders');
        } else {
          console.error('Failed to load orders. Please try again.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [auth.token, navigate, logout, setOrders, currentPage, statusFilter]);

  // Filter orders by search query (client-side)
  const filteredOrders = searchQuery
    ? orders.filter((order) => order.id.toLowerCase().includes(searchQuery.toLowerCase()))
    : orders;

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'Pending':
        return 'bg-amber-100 text-amber-800';
      case 'Confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'Completed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatItems = (items, orderId, hasDetails) => {
    if (!hasDetails || !items || items.length === 0) {
      return <span className="text-gray-500 italic">No items available</span>;
    }
    return items.map((item, index) => (
      <span key={index}>
        <Link
          to={`/item/${orderId}/${index}`}
          className="text-indigo-600 hover:text-indigo-800 transition-colors"
          aria-label={`View details for ${item.title} in order ${orderId}`}
        >
          {item.title} x{item.quantity}
        </Link>
        {index < items.length - 1 && ', '}
      </span>
    ));
  };

  return (
    <main className="flex-1 bg-gray-100 p-4 sm:p-6 lg:p-8 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-8 animate-fade-in">Your Orders</h1>
        <div className="bg-white rounded-xl shadow-sm p-6 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-8">
            <div className="relative flex-1 sm:max-w-xs">
              <input
                type="text"
                placeholder="Search by order number..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 placeholder-gray-400 transition-all duration-200"
              />
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
            <div className="flex-1 sm:flex-none">
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full sm:w-48 p-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 transition-all duration-200"
              >
                <option value="All">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>

          <div className="hidden md:block overflow-x-auto">
            {loading ? (
              <div className="text-center text-gray-500 py-8">Loading orders...</div>
            ) : (
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="p-4 font-semibold text-gray-700">Order Number</th>
                    <th className="p-4 font-semibold text-gray-700">Date</th>
                    <th className="p-4 font-semibold text-gray-700">Items</th>
                    <th className="p-4 font-semibold text-gray-700">Total</th>
                    <th className="p-4 font-semibold text-gray-700">Status</th>
                    <th className="p-4 font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-4 text-center text-gray-500">
                        No orders found matching your criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.map((order) => (
                      <tr
                        key={order.id}
                        className="border-b border-gray-200 hover:bg-gray-50 transition-colors duration-150"
                      >
                        <td className="p-4 text-gray-900">#{order.id}</td>
                        <td className="p-4 text-gray-600">{new Date(order.date).toLocaleDateString('en-GB')}</td>
                        <td className="p-4 text-gray-600">{formatItems(order.items, order.id, order.hasDetails)}</td>
                        <td className="p-4 text-gray-900">£{order.total.toFixed(2)}</td>
                        <td className="p-4">
                          <span
                            className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${getStatusClass(order.status)}`}
                          >
                            {order.status}
                          </span>
                        </td>
                        <td className="p-4">
                          {order.hasDetails ? (
                            <Link
                              to={`/order/${order.id}`}
                              className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200 font-medium"
                              aria-label={`View details for order ${order.id}`}
                            >
                              View Details
                            </Link>
                          ) : (
                            <span className="text-gray-500 italic">No details available</span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}
          </div>

          <div className="md:hidden space-y-4">
            {loading ? (
              <div className="text-center text-gray-500 py-8">Loading orders...</div>
            ) : filteredOrders.length === 0 ? (
              <div className="text-center text-gray-500 py-8">No orders found matching your criteria.</div>
            ) : (
              filteredOrders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow duration-200"
                >
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-gray-900 font-medium">#{order.id}</span>
                    <span
                      className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${getStatusClass(order.status)}`}
                    >
                      {order.status}
                    </span>
                  </div>
                  <div className="text-gray-600 mb-2">
                    <span className="font-medium">Date:</span>{' '}
                    {new Date(order.date).toLocaleDateString('en-GB')}
                  </div>
                  <div className="text-gray-600 mb-2">
                    <span className="font-medium">Items:</span>{' '}
                    {formatItems(order.items, order.id, order.hasDetails)}
                  </div>
                  <div className="text-gray-600 mb-4">
                    <span className="font-medium">Total:</span> £{order.total.toFixed(2)}
                  </div>
                  <div>
                    {order.hasDetails ? (
                      <Link
                        to={`/order/${order.id}`}
                        className="block text-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200 font-medium"
                        aria-label={`View details for order ${order.id}`}
                      >
                        View Details
                      </Link>
                    ) : (
                      <span className="block text-center text-gray-500 italic">No details available</span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Pagination Controls */}
          {!loading && totalOrders > 0 && (
            <div className="mt-8 flex justify-center items-center space-x-2">
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                  currentPage === 1
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-indigo-600 text-white hover:bg-indigo-700'
                }`}
              >
                Previous
              </button>
              <div className="flex space-x-1">
                {Array.from({ length: totalPages }, (_, index) => (
                  <button
                    key={index + 1}
                    onClick={() => paginate(index + 1)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                      currentPage === index + 1
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                  currentPage === totalPages
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-indigo-600 text-white hover:bg-indigo-700'
                }`}
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

// --- OrdersPage Component ---
const OrdersPage = () => {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [orders, setOrders] = useState([]);
  const location = useLocation();
  const { id } = useParams();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-in');
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    const elements = document.querySelectorAll('.animate-fade-in');
    elements.forEach((el) => observer.observe(el));

    return () => {
      elements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  useEffect(() => {
    setIsDetailsOpen(location.pathname.startsWith('/order/') && !!id);
  }, [location.pathname, id]);

  return (
    <div className="flex min-h-screen bg-gray-100 font-sans flex-col">
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fadeIn 0.5s ease-out forwards; opacity: 0; }
      `}</style>
      <TopBar />
      {location.pathname.startsWith('/item/') ? <ItemDetails orders={orders} /> : <MainContent setOrders={setOrders} />}
      <OrderDetailsSidebar isOpen={isDetailsOpen} onClose={() => setIsDetailsOpen(false)} />
      <Footer />
    </div>
  );
};

export default OrdersPage;