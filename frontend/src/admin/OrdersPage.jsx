import React, { useState, useEffect } from 'react';
import { Search, Filter } from 'lucide-react';
import './OrdersPage.css';
import Spinner from '../COMPONENTS/Spinner';

// --- Mock Data Simulation ---
const allOrdersData = [
  { id: '#ORD-2024-001', order_number: '2024-001', customer_name: 'Sarah Johnson', customer_email: 'sarah.j@email.com', status: 'Delivered', total_amount: 87.50, created_date: '2025-08-20T10:30:00Z' },
  { id: '#ORD-2024-002', order_number: '2024-002', customer_name: 'Mike Chen', customer_email: 'mike.c@email.com', status: 'Out for Delivery', total_amount: 156.75, created_date: '2025-08-20T11:00:00Z' },
  { id: '#ORD-2024-003', order_number: '2024-003', customer_name: 'Emily Rodriguez', customer_email: 'emily.r@email.com', status: 'Preparing', total_amount: 234.20, created_date: '2025-08-19T14:00:00Z' },
  { id: '#ORD-2024-004', order_number: '2024-004', customer_name: 'David Wilson', customer_email: 'david.w@email.com', status: 'Confirmed', total_amount: 92.30, created_date: '2025-08-19T09:00:00Z' },
  { id: '#ORD-2024-005', order_number: '2024-005', customer_name: 'Lisa Thompson', customer_email: 'lisa.t@email.com', status: 'Pending', total_amount: 67.85, created_date: '2025-08-18T16:00:00Z' },
  { id: '#ORD-2024-006', order_number: '2024-006', customer_name: 'James Brown', customer_email: 'james.b@email.com', status: 'Cancelled', total_amount: 110.00, created_date: '2025-08-18T12:00:00Z' },
];
// --- End Mock Data ---

const StatusBadge = ({ status }) => {
  const statusClass = status.toLowerCase().replace(/ /g, '-');
  return <span className={`status-badge ${statusClass}`}>{status}</span>;
};

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    // Simulate fetching data
    const loadOrders = () => {
      setTimeout(() => {
        setOrders(allOrdersData);
        setLoading(false);
      }, 1000);
    };
    loadOrders();
  }, []);

  useEffect(() => {
    let filtered = orders;

    if (searchTerm) {
      filtered = filtered.filter(order =>
        order.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.order_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer_email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      const formattedStatus = statusFilter.replace(/-/g, ' ');
      filtered = filtered.filter(order => order.status.toLowerCase() === formattedStatus);
    }

    setFilteredOrders(filtered);
  }, [orders, searchTerm, statusFilter]);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <Spinner />;

  return (
    <div className="orders-page">
      <div className="orders-header">
        <h1>Orders Management</h1>
        <p>Track and manage all customer orders</p>
      </div>

      <div className="card filter-card">
        <div className="card-header">
          <h3 className="filter-card-title">
            <Filter size={20} />
            Filter Orders
          </h3>
        </div>
        <div className="filter-controls">
          <div className="filter-search-input">
            <Search />
            <input
              type="text"
              placeholder="Search by customer name, email, or order number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select 
            className="filter-select-trigger" 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="preparing">Preparing</option>
            <option value="out-for-delivery">Out for Delivery</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      <div className="card orders-table-card">
        <div className="table-wrapper">
          <table className="orders-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Status</th>
                <th>Amount</th>
                <th>Date</th>
                {/* Actions column removed */}
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order.id}>
                  <td className="order-number">#{order.order_number}</td>
                  <td>
                    <p className="customer-name">{order.customer_name}</p>
                    <p className="customer-email">{order.customer_email}</p>
                  </td>
                  <td><StatusBadge status={order.status} /></td>
                  <td>₹{order.total_amount?.toFixed(2)}</td>
                  <td>{new Date(order.created_date).toLocaleDateString()}</td>
                  {/* Actions cell removed */}
                </tr>
              ))}
            </tbody>
          </table>
          {filteredOrders.length === 0 && (
            <div className="no-orders-found">
                <div className="no-orders-icon-wrapper">
                    <Search />
                </div>
                <h3>No orders found</h3>
                <p>Try adjusting your search or filter criteria</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
