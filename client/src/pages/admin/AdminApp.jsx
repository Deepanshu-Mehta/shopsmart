import { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout.jsx';
import Products from './Products.jsx';
import ProductForm from './ProductForm.jsx';
import Newsletter from './Newsletter.jsx';
import Users from './Users.jsx';
import '../../components/admin/admin.css';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5001';

export default function AdminApp() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${API}/auth/me`, { credentials: 'include' })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        setUser(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleLogout = () => {
    setUser(null);
    navigate('/', { replace: true });
  };

  if (loading) {
    return <div className="admin-loading">Loading…</div>;
  }

  if (!user || user.role !== 'ADMIN') {
    return <Navigate to="/" replace />;
  }

  return (
    <AdminLayout user={user} onLogout={handleLogout}>
      <Routes>
        <Route index element={<Navigate to="products" replace />} />
        <Route path="products" element={<Products />} />
        <Route path="products/new" element={<ProductForm />} />
        <Route path="products/:id/edit" element={<ProductForm />} />
        <Route path="newsletter" element={<Newsletter />} />
        <Route path="users" element={<Users />} />
      </Routes>
    </AdminLayout>
  );
}
