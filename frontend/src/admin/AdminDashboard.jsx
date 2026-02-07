import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, AlertTriangle, Truck } from 'lucide-react';
import './AdminDashboard.css';

// --- Mock Data Simulation ---
const allOrdersData = [
  { id: '#ORD-2024-001', customer: { name: 'Sarah Johnson', email: 'sarah.johnson@email.com' }, status: 'Delivered', amount: '₹87.50', date: '8/20/2025' },
  { id: '#ORD-2024-002', customer: { name: 'Mike Chen', email: 'mike.chen@email.com' }, status: 'Out for Delivery', amount: '₹156.75', date: '8/20/2025' },
  { id: '#ORD-2024-003', customer: { name: 'Emily Rodriguez', email: 'emily.rodriguez@email.com' }, status: 'Preparing', amount: '₹234.20', date: '8/20/2025' },
  { id: '#ORD-2024-004', customer: { name: 'David Wilson', email: 'david.wilson@email.com' }, status: 'Confirmed', amount: '₹92.30', date: '8/20/2025' },
  { id: '#ORD-2024-005', customer: { name: 'Lisa Thompson', email: 'lisa.thompson@email.com' }, status: 'Pending', amount: '₹67.85', date: '8/20/2025' },
];

const allProductsData = [
  { id: 1, name: 'Fresh Milk', details: 'Only 8 liter left', stock: 8, lowStockThreshold: 10 },
  { id: 2, name: 'Fresh Spinach', details: 'Only 5 bunch left', stock: 5, lowStockThreshold: 10 },
  { id: 3, name: 'Orange Juice', details: 'Only 3 bottle left', stock: 3, lowStockThreshold: 5 },
  { id: 4, 'name': 'Organic Tomatoes', details: 'Only 7 kg left', stock: 7, lowStockThreshold: 10 },
];


// --- Helper Components ---

const Spinner = () => (
  <div className="loading-container">
    <div className="spinner"></div>
    <p className="loading-text">Loading Dashboard...</p>
  </div>
);

const StatCard = ({ icon, title, value, description, badgeText, color }) => {
  const IconComponent = icon;
  return (
    <div className="stat-card">
      <div className="stat-card-header">
        <div className={`stat-card-icon ${color}`}>
          <IconComponent size={20} />
        </div>
        {badgeText && <div className={`stat-card-badge ${color}`}>{badgeText}</div>}
      </div>
      <div className="stat-card-body">
        <p className="stat-card-title">{title}</p>
        <p className="stat-card-value">{value}</p>
        <p className="stat-card-description">{description}</p>
      </div>
    </div>
  );
};

const RecentOrdersTable = ({ orders }) => {
    const navigate = useNavigate();
    return (
        <div className="card">
        <div className="card-header">
            <h3 className="card-title">Recent Orders</h3>
            <button className="view-all-btn" onClick={() => navigate('/admin/orders')}>View All Orders</button>
        </div>
        <div className="table-wrapper">
            <table className="orders-table">
            <thead>
                <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Amount</th>
                <th>Date</th>
                </tr>
            </thead>
            <tbody>
                {orders.map((order, index) => (
                <tr key={index}>
                    <td className="order-id">{order.id}</td>
                    <td>
                      <p className="customer-name">{order.customer.name}</p>
                      <p className="customer-email">{order.customer.email}</p>
                    </td>
                    <td>{order.amount}</td>
                    <td>{order.date}</td>
                </tr>
                ))}
            </tbody>
            </table>
        </div>
        </div>
    );
};

const LowStockAlerts = ({ products, onRestock }) => {
    const iconMap = {
        'Fresh Milk': '🥛', 'Fresh Spinach': '🥬', 'Orange Juice': '🍊',
        'Organic Tomatoes': '🍅', 'Whole Wheat Bread': '🍞', 'Free-Range Eggs': '🥚',
    }
  return (
    <div className="card">
      <div className="low-stock-header">
        <AlertTriangle color="#EF4444" />
        <h3 className="low-stock-title">Low Stock Alerts</h3>
        <span className="low-stock-badge">{products.length}</span>
      </div>
      <div className="low-stock-list">
        {products.map((item, index) => (
          <div key={index} className="low-stock-item">
            <div className="low-stock-item-info">
              <div className="low-stock-icon">{iconMap[item.name] || '📦'}</div>
              <div className="low-stock-details">
                <p>{item.name}</p><p>{item.details}</p>
              </div>
            </div>
            <button className="restock-btn" onClick={() => onRestock(item)}>Restock</button>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- Main Admin Dashboard Page Component ---
export default function AdminDashboard() {
  const [orders, setOrders] = React.useState([]);
  const [products, setProducts] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const loadDashboardData = () => {
      setTimeout(() => {
        setOrders(allOrdersData);
        setProducts(allProductsData);
        setLoading(false);
      }, 1000); // Simulate network delay
    };
    loadDashboardData();
  }, []);

  const handleRestock = (productToRestock) => {
    setProducts(products.filter(p => p.id !== productToRestock.id));
  };

  if (loading) {
    return <Spinner />;
  }

  const lowStockProducts = products.filter(p => p.stock <= p.lowStockThreshold);
  const pendingDeliveries = orders.filter(o => ['Preparing', 'Confirmed', 'Out for Delivery'].includes(o.status)).length;

  return (
    <>
      <div className="stats-grid">
        <StatCard 
          icon={ShoppingCart}
          title="TOTAL ORDERS"
          value={orders.length} 
          description="Orders this month"
          badgeText="+12% from last month"
          color="green"
        />
        <StatCard 
          icon={AlertTriangle}
          title="LOW STOCK ALERTS"
          value={lowStockProducts.length}
          description="Products running low"
          badgeText="Needs attention"
          color="red"
        />
        <StatCard 
          icon={Truck}
          title="PENDING DELIVERIES"
          value={pendingDeliveries}
          description="Orders in progress"
          badgeText="Active deliveries"
          color="yellow"
        />
      </div>
      <div className="main-grid">
        <div className="main-grid-item-lg-2">
          <RecentOrdersTable orders={orders} />
        </div>
        <div>
          <LowStockAlerts products={lowStockProducts} onRestock={handleRestock} />
        </div>
      </div>
    </>
  );
}
