import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5001';

export default function Dashboard() {
  const [stats, setStats] = useState({
    products: 0,
    users: 0,
    subscribers: 0,
    orders: 0,
  });
  const [recentProducts, setRecentProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch(`${API}/api/admin/products`, { credentials: 'include' }).then((r) =>
        r.ok ? r.json() : []
      ),
      fetch(`${API}/api/admin/users`, { credentials: 'include' }).then((r) =>
        r.ok ? r.json() : []
      ),
      fetch(`${API}/api/admin/newsletter`, { credentials: 'include' }).then((r) =>
        r.ok ? r.json() : []
      ),
    ])
      .then(([products, users, subscribers]) => {
        setStats({
          products: products.length,
          users: users.length,
          subscribers: subscribers.length,
          orders: 0, // Placeholder - orders not implemented yet
        });
        setRecentProducts(products.slice(0, 5));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const statCards = [
    {
      label: 'Total Products',
      value: stats.products,
      icon: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <rect x="2" y="2" width="7" height="7" stroke="currentColor" strokeWidth="1.5" />
          <rect x="11" y="2" width="7" height="7" stroke="currentColor" strokeWidth="1.5" />
          <rect x="2" y="11" width="7" height="7" stroke="currentColor" strokeWidth="1.5" />
          <rect x="11" y="11" width="7" height="7" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      ),
      link: '/admin/products',
    },
    {
      label: 'Active Users',
      value: stats.users,
      icon: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <circle cx="10" cy="6" r="4" stroke="currentColor" strokeWidth="1.5" />
          <path d="M2 18C2 14 6 12 10 12C14 12 18 14 18 18" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      ),
      link: '/admin/users',
    },
    {
      label: 'Newsletter Subscribers',
      value: stats.subscribers,
      icon: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <rect x="2" y="4" width="16" height="12" rx="1" stroke="currentColor" strokeWidth="1.5" />
          <path d="M2 4L10 10L18 4" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      ),
      link: '/admin/newsletter',
    },
    {
      label: 'Total Orders',
      value: stats.orders,
      icon: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M1 4H3L5 14H15L17 6H4" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="7" cy="17" r="1.5" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="13" cy="17" r="1.5" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      ),
      link: '/admin/orders',
    },
  ];

  if (loading) {
    return <div className="admin-empty">Loading dashboard...</div>;
  }

  return (
    <>
      <div className="admin-page-header">
        <h1 className="admin-page-heading">Dashboard</h1>
        <span className="admin-stat">Welcome back</span>
      </div>

      {/* Stat Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 20,
          marginBottom: 32,
        }}
        className="dashboard-stats"
      >
        {statCards.map((stat) => (
          <Link
            key={stat.label}
            to={stat.link}
            className="admin-card"
            style={{
              padding: 24,
              display: 'flex',
              flexDirection: 'column',
              gap: 16,
              transition: 'border-color 200ms',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <span
                style={{
                  color: 'var(--a-accent)',
                  opacity: 0.8,
                }}
              >
                {stat.icon}
              </span>
              <span
                style={{
                  fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
                  fontSize: 32,
                  fontWeight: 300,
                  color: 'var(--a-text)',
                }}
              >
                {stat.value}
              </span>
            </div>
            <span
              style={{
                fontSize: 11,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: 'var(--a-text-muted)',
              }}
            >
              {stat.label}
            </span>
          </Link>
        ))}
      </div>

      {/* Recent Products */}
      <div className="admin-card">
        <div className="admin-card-header">
          <span className="admin-card-title">Recent Products</span>
          <Link
            to="/admin/products"
            style={{
              fontSize: 12,
              color: 'var(--a-text-muted)',
              textDecoration: 'underline',
            }}
          >
            View All
          </Link>
        </div>

        {recentProducts.length === 0 ? (
          <div className="admin-empty">No products yet</div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Price</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentProducts.map((p) => (
                <tr key={p.id}>
                  <td>
                    <Link
                      to={`/admin/products/${p.id}/edit`}
                      style={{ fontWeight: 500, color: 'var(--a-text)' }}
                    >
                      {p.name}
                    </Link>
                  </td>
                  <td style={{ color: 'var(--a-text-muted)' }}>{p.categoryLabel || p.category}</td>
                  <td>{p.priceLabel}</td>
                  <td>
                    <span
                      className={`admin-badge ${p.isActive ? 'admin-badge-green' : 'admin-badge-gray'}`}
                    >
                      {p.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Quick Actions */}
      <div style={{ marginTop: 32 }}>
        <h2
          style={{
            fontSize: 14,
            fontWeight: 500,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            marginBottom: 16,
            color: 'var(--a-text-muted)',
          }}
        >
          Quick Actions
        </h2>
        <div style={{ display: 'flex', gap: 12 }}>
          <Link to="/admin/products/new" className="admin-btn admin-btn-primary">
            + Add Product
          </Link>
          <Link to="/admin/newsletter" className="admin-btn admin-btn-secondary">
            View Subscribers
          </Link>
          <Link to="/" className="admin-btn admin-btn-secondary">
            Visit Store
          </Link>
        </div>
      </div>

      <style>{`
        @media (max-width: 1023px) {
          .dashboard-stats { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 600px) {
          .dashboard-stats { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  );
}
