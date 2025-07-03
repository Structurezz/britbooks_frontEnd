import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar'; 
import TopBar from '../components/Topbar';   

const SearchIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
);

const orders = [
  { id: '#12345', date: '2025-06-20', total: 45.99, status: 'Processing', hasDetails: false },
  { id: '#12346', date: '2025-06-18', total: 29.50, status: 'Dispatched', hasDetails: true },
  { id: '#12347', date: '2025-06-15', total: 60.75, status: 'Delivered', hasDetails: false },
  { id: '#12348', date: '2025-06-12', total: 15.99, status: 'Delivered', hasDetails: true },
  { id: '#12349', date: '2025-06-10', total: 89.25, status: 'Processing', hasDetails: false },
  { id: '#12350', date: '2025-06-08', total: 32.00, status: 'Dispatched', hasDetails: true },
  { id: '#12351', date: '2025-06-05', total: 55.40, status: 'Processing', hasDetails: false },
  { id: '#12352', date: '2025-06-03', total: 22.80, status: 'Delivered', hasDetails: true },
];

// --- MainContent Component ---
const MainContent = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortOption, setSortOption] = useState('date-desc');

  // Filter and sort orders
  const filteredOrders = orders
    .filter((order) =>
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
      case 'Processing': return 'bg-yellow-100 text-yellow-800';
      case 'Dispatched': return 'bg-blue-100 text-blue-800';
      case 'Delivered': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <main className="flex-1 bg-gray-50 p-4 sm:p-6 lg:p-8 overflow-y-auto min-h-screen pb-16 lg:pb-8">
      <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-gray-800">Your Orders</h1>
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm">
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
                <th className="p-3 sm:p-4 font-semibold text-sm sm:text-base">Total</th>
                <th className="p-3 sm:p-4 font-semibold text-sm sm:text-base">Status</th>
                <th className="p-3 sm:p-4 font-semibold text-sm sm:text-base">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-4 text-center text-gray-500 text-sm sm:text-base">
                    No orders found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-b last:border-none hover:bg-gray-100 transition-colors"
                  >
                    <td className="p-3 sm:p-4 text-gray-700 text-sm sm:text-base">{order.id}</td>
                    <td className="p-3 sm:p-4 text-gray-700 text-sm sm:text-base">
                      {new Date(order.date).toLocaleDateString('en-GB')}
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
                        >
                          View Details
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
                  <span className="text-sm font-semibold text-gray-700">{order.id}</span>
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
                <div className="text-sm text-gray-600 mb-3">
                  <span className="font-medium">Total:</span> £{order.total.toFixed(2)}
                </div>
                <div>
                  {order.hasDetails ? (
                    <Link
                      to={`/order/${order.id}`}
                      className="block text-center bg-blue-600 text-white px-3 py-1 rounded-md font-semibold hover:bg-blue-700 transition-colors text-sm"
                    >
                      View Details
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

  return (
    <div className="flex min-h-screen bg-gray-100 font-sans flex-col lg:flex-row">
      {/* Main Sidebar (handled by Sidebar component) */}
      <Sidebar activeLink={activeLink} setActiveLink={setActiveLink} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:ml-64">
        <TopBar />
        <MainContent />
      </div>
    </div>
  );
};

export default OrdersPage;