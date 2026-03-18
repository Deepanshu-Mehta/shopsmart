import { NavLink, Link } from 'react-router-dom';
import './admin.css';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5001';

export default function AdminLayout({ user, children, onLogout }) {
  const handleLogout = async () => {
    await fetch(`${API}/auth/logout`, { method: 'POST', credentials: 'include' });
    onLogout?.();
  };

  return (
    <div className="admin-shell">
      {/* ── Sidebar ──────────────────────────────────────────────── */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar-brand">
          <Link to="/" className="admin-sidebar-brand-name">VESTIR</Link>
          <span className="admin-sidebar-label">Admin Console</span>
        </div>

        <nav className="admin-nav">
          <div className="admin-nav-section">
            <div className="admin-nav-section-title">Catalogue</div>
            <NavLink to="/admin/products" className="admin-nav-link">
              Products
            </NavLink>
          </div>
          <div className="admin-nav-section">
            <div className="admin-nav-section-title">Audience</div>
            <NavLink to="/admin/newsletter" className="admin-nav-link">
              Newsletter
            </NavLink>
            <NavLink to="/admin/users" className="admin-nav-link">
              Users
            </NavLink>
          </div>
        </nav>

        <div className="admin-sidebar-footer">
          <Link to="/">← View Store</Link>
          <button onClick={handleLogout}>Sign Out</button>
        </div>
      </aside>

      {/* ── Main ─────────────────────────────────────────────────── */}
      <div className="admin-main">
        <header className="admin-topbar">
          <span className="admin-topbar-title">Admin</span>
          {user && (
            <span className="admin-topbar-user">
              {user.name || user.email}
            </span>
          )}
        </header>
        <main className="admin-content">{children}</main>
      </div>
    </div>
  );
}
