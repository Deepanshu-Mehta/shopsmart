import { useState } from 'react';

// Mock orders data for demo
const MOCK_ORDERS = [
  {
    id: 'ORD-001',
    customer: 'Priya Sharma',
    email: 'priya@example.com',
    date: '2025-05-01',
    total: '₹12,400',
    status: 'delivered',
    items: 3,
  },
  {
    id: 'ORD-002',
    customer: 'Rahul Mehta',
    email: 'rahul@example.com',
    date: '2025-04-30',
    total: '₹8,600',
    status: 'shipped',
    items: 2,
  },
  {
    id: 'ORD-003',
    customer: 'Ananya Patel',
    email: 'ananya@example.com',
    date: '2025-04-29',
    total: '₹15,200',
    status: 'processing',
    items: 4,
  },
  {
    id: 'ORD-004',
    customer: 'Vikram Singh',
    email: 'vikram@example.com',
    date: '2025-04-28',
    total: '₹6,800',
    status: 'pending',
    items: 1,
  },
];

const STATUS_STYLES = {
  pending: 'admin-badge-gray',
  processing: 'admin-badge-gold',
  shipped: 'admin-badge-green',
  delivered: 'admin-badge-green',
  cancelled: 'admin-badge-gray',
};

export default function Orders() {
  const [statusFilter, setStatusFilter] = useState('all');
  const orders = MOCK_ORDERS;

  const filtered = statusFilter === 'all'
    ? orders
    : orders.filter((o) => o.status === statusFilter);

  return (
    <>
      <div className="admin-page-header">
        <h1 className="admin-page-heading">Orders</h1>
        <span className="admin-stat">{orders.length} total orders</span>
      </div>

      <div className="admin-card">
        <div className="admin-card-header">
          <span className="admin-card-title">Order Management</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="admin-select"
            style={{ width: 'auto', padding: '6px 32px 6px 12px' }}
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
          </select>
        </div>

        {filtered.length === 0 ? (
          <div className="admin-empty">No orders found</div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Date</th>
                <th>Items</th>
                <th>Total</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((order) => (
                <tr key={order.id}>
                  <td style={{ fontWeight: 500 }}>{order.id}</td>
                  <td>
                    <div>
                      <div>{order.customer}</div>
                      <div style={{ fontSize: 11, color: 'var(--a-text-muted)' }}>
                        {order.email}
                      </div>
                    </div>
                  </td>
                  <td style={{ color: 'var(--a-text-muted)' }}>{order.date}</td>
                  <td>{order.items} items</td>
                  <td style={{ fontWeight: 500 }}>{order.total}</td>
                  <td>
                    <span className={`admin-badge ${STATUS_STYLES[order.status]}`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button className="admin-btn admin-btn-secondary admin-btn-sm">
                        View
                      </button>
                      {order.status === 'pending' && (
                        <button className="admin-btn admin-btn-primary admin-btn-sm">
                          Process
                        </button>
                      )}
                      {order.status === 'processing' && (
                        <button className="admin-btn admin-btn-primary admin-btn-sm">
                          Ship
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Order Stats */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 20,
          marginTop: 32,
        }}
        className="order-stats"
      >
        {[
          { label: 'Pending', count: orders.filter((o) => o.status === 'pending').length, color: '#6b6b6b' },
          { label: 'Processing', count: orders.filter((o) => o.status === 'processing').length, color: '#c9a96e' },
          { label: 'Shipped', count: orders.filter((o) => o.status === 'shipped').length, color: '#2d7a4a' },
          { label: 'Delivered', count: orders.filter((o) => o.status === 'delivered').length, color: '#2d7a4a' },
        ].map((stat) => (
          <div
            key={stat.label}
            className="admin-card"
            style={{
              padding: 20,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <span
              style={{
                fontSize: 12,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                color: 'var(--a-text-muted)',
              }}
            >
              {stat.label}
            </span>
            <span
              style={{
                fontSize: 24,
                fontWeight: 300,
                color: stat.color,
              }}
            >
              {stat.count}
            </span>
          </div>
        ))}
      </div>

      <style>{`
        @media (max-width: 1023px) {
          .order-stats { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 600px) {
          .order-stats { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  );
}
