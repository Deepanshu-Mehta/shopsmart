import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5001';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionError, setActionError] = useState('');

  const fetchProducts = () => {
    setLoading(true);
    fetch(`${API}/api/admin/products`, { credentials: 'include' })
      .then((r) => (r.ok ? r.json() : Promise.reject(r)))
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load products');
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const toggleActive = async (product) => {
    setActionError('');
    try {
      const res = await fetch(`${API}/api/admin/products/${product.id}`, {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !product.isActive }),
      });
      if (!res.ok) throw new Error('Failed to update');
      setProducts((prev) =>
        prev.map((p) => (p.id === product.id ? { ...p, isActive: !p.isActive } : p))
      );
    } catch {
      setActionError('Failed to update product status');
    }
  };

  const softDelete = async (product) => {
    if (!window.confirm(`Archive "${product.name}"? It will be hidden from the storefront.`)) return;
    setActionError('');
    try {
      const res = await fetch(`${API}/api/admin/products/${product.id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Failed to archive');
      setProducts((prev) => prev.filter((p) => p.id !== product.id));
    } catch {
      setActionError('Failed to archive product');
    }
  };

  return (
    <>
      <div className="admin-page-header">
        <h1 className="admin-page-heading">Products</h1>
        <Link to="/admin/products/new" className="admin-btn admin-btn-primary">
          + Add Product
        </Link>
      </div>

      {error && <div className="admin-error">{error}</div>}
      {actionError && <div className="admin-error">{actionError}</div>}

      <div className="admin-card">
        <div className="admin-card-header">
          <span className="admin-card-title">All Products</span>
          <span className="admin-stat">{products.length} items</span>
        </div>

        {loading ? (
          <div className="admin-empty">Loading…</div>
        ) : products.length === 0 ? (
          <div className="admin-empty">No products yet</div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id}>
                  <td style={{ color: 'var(--a-text-muted)', width: 48 }}>#{p.id}</td>
                  <td style={{ fontWeight: 500 }}>{p.name}</td>
                  <td style={{ color: 'var(--a-text-muted)' }}>{p.categoryLabel || p.category}</td>
                  <td>{p.priceLabel}</td>
                  <td>
                    <span className={`admin-badge ${p.isActive ? 'admin-badge-green' : 'admin-badge-gray'}`}>
                      {p.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <Link
                        to={`/admin/products/${p.id}/edit`}
                        className="admin-btn admin-btn-secondary admin-btn-sm"
                      >
                        Edit
                      </Link>
                      <button
                        className="admin-btn admin-btn-secondary admin-btn-sm"
                        onClick={() => toggleActive(p)}
                      >
                        {p.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                      <button
                        className="admin-btn admin-btn-danger admin-btn-sm"
                        onClick={() => softDelete(p)}
                      >
                        Archive
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
