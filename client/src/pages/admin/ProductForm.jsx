import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5001';

const CATEGORIES = [
  { value: 'tops', label: 'Tops' },
  { value: 'bottoms', label: 'Bottoms' },
  { value: 'outerwear', label: 'Outerwear' },
  { value: 'accessories', label: 'Accessories' },
];

const EMPTY = {
  name: '',
  slug: '',
  category: 'tops',
  categoryLabel: 'Tops',
  price: '',
  priceLabel: '',
  filter: 'tops',
  imgUrl: '',
  hoverImgUrl: '',
  imgClass: '',
  hoverClass: '',
  details: '',
  materials: '',
  shipping: '',
  isActive: true,
};

function toSlug(str) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

function toPriceLabel(paise) {
  const num = parseInt(paise, 10);
  if (isNaN(num)) return '';
  return `₹${num.toLocaleString('en-IN')}`;
}

export default function ProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [form, setForm] = useState(EMPTY);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    if (!isEdit) return;
    fetch(`${API}/api/products/${id}`, { credentials: 'include' })
      .then((r) => (r.ok ? r.json() : Promise.reject(r)))
      .then((data) => {
        setForm({
          name: data.name ?? '',
          slug: data.slug ?? '',
          category: data.category ?? 'tops',
          categoryLabel: data.categoryLabel ?? '',
          price: data.price?.toString() ?? '',
          priceLabel: data.priceLabel ?? '',
          filter: data.filter ?? '',
          imgUrl: data.imgUrl ?? '',
          hoverImgUrl: data.hoverImgUrl ?? '',
          imgClass: data.imgClass ?? '',
          hoverClass: data.hoverClass ?? '',
          details: data.details ?? '',
          materials: data.materials ?? '',
          shipping: data.shipping ?? '',
          isActive: data.isActive ?? true,
        });
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load product');
        setLoading(false);
      });
  }, [id, isEdit]);

  const set = (field) => (e) => {
    const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm((prev) => {
      const next = { ...prev, [field]: val };
      // Auto-sync dependent fields
      if (field === 'name' && !isEdit) next.slug = toSlug(val);
      if (field === 'price') next.priceLabel = toPriceLabel(val);
      if (field === 'category') {
        const cat = CATEGORIES.find((c) => c.value === val);
        next.categoryLabel = cat?.label ?? val;
        next.filter = val;
      }
      return next;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    const payload = {
      ...form,
      price: parseInt(form.price, 10),
      imgUrl: form.imgUrl || null,
      hoverImgUrl: form.hoverImgUrl || null,
    };

    try {
      const url = isEdit
        ? `${API}/api/admin/products/${id}`
        : `${API}/api/admin/products`;
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Save failed');
        setSaving(false);
        return;
      }

      // Upload image if one was selected
      if (imageFile && data.id) {
        const fd = new FormData();
        fd.append('image', imageFile);
        await fetch(`${API}/api/admin/products/${data.id}/image`, {
          method: 'POST',
          credentials: 'include',
          body: fd,
        });
      }

      navigate('/admin/products');
    } catch {
      setError('Network error — please try again');
      setSaving(false);
    }
  };

  if (loading) return <div className="admin-empty">Loading…</div>;

  return (
    <>
      <div className="admin-page-header">
        <h1 className="admin-page-heading">{isEdit ? 'Edit Product' : 'New Product'}</h1>
        <Link to="/admin/products" className="admin-btn admin-btn-secondary">
          ← Back
        </Link>
      </div>

      {error && <div className="admin-error">{error}</div>}

      <div className="admin-card">
        <form onSubmit={handleSubmit} className="admin-form" style={{ padding: 24 }}>
          {/* Name + Slug */}
          <div className="admin-form-row">
            <div className="admin-form-group">
              <label className="admin-label">Product Name *</label>
              <input
                className="admin-input"
                value={form.name}
                onChange={set('name')}
                required
                placeholder="e.g. Silk Column Shirt"
              />
            </div>
            <div className="admin-form-group">
              <label className="admin-label">Slug *</label>
              <input
                className="admin-input"
                value={form.slug}
                onChange={set('slug')}
                required
                placeholder="e.g. silk-column-shirt"
              />
            </div>
          </div>

          {/* Category + Price */}
          <div className="admin-form-row">
            <div className="admin-form-group">
              <label className="admin-label">Category *</label>
              <select className="admin-select" value={form.category} onChange={set('category')}>
                {CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>
            <div className="admin-form-group">
              <label className="admin-label">Price (₹ in paise) *</label>
              <input
                className="admin-input"
                type="number"
                min="1"
                value={form.price}
                onChange={set('price')}
                required
                placeholder="e.g. 5600 for ₹5,600"
              />
              {form.priceLabel && (
                <span style={{ fontSize: 11, color: 'var(--a-text-muted)', marginTop: 2 }}>
                  {form.priceLabel}
                </span>
              )}
            </div>
          </div>

          {/* Image URLs */}
          <div className="admin-form-row">
            <div className="admin-form-group">
              <label className="admin-label">Image URL</label>
              <input
                className="admin-input"
                value={form.imgUrl}
                onChange={set('imgUrl')}
                placeholder="https://…"
              />
            </div>
            <div className="admin-form-group">
              <label className="admin-label">Hover Image URL</label>
              <input
                className="admin-input"
                value={form.hoverImgUrl}
                onChange={set('hoverImgUrl')}
                placeholder="https://…"
              />
            </div>
          </div>

          {/* Image upload */}
          <div className="admin-form-group">
            <label className="admin-label">Upload Image to Cloudinary</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files?.[0] || null)}
              style={{ fontSize: 13 }}
            />
            <span style={{ fontSize: 11, color: 'var(--a-text-muted)' }}>
              Overwrites the image URL above on save.
            </span>
          </div>

          {/* CSS classes */}
          <div className="admin-form-row">
            <div className="admin-form-group">
              <label className="admin-label">Image Class</label>
              <input className="admin-input" value={form.imgClass} onChange={set('imgClass')} />
            </div>
            <div className="admin-form-group">
              <label className="admin-label">Hover Class</label>
              <input className="admin-input" value={form.hoverClass} onChange={set('hoverClass')} />
            </div>
          </div>

          {/* Text fields */}
          <div className="admin-form-group full-width">
            <label className="admin-label">Product Details</label>
            <textarea
              className="admin-textarea"
              value={form.details}
              onChange={set('details')}
              rows={4}
              placeholder="Describe the product…"
            />
          </div>

          <div className="admin-form-row">
            <div className="admin-form-group">
              <label className="admin-label">Materials</label>
              <textarea
                className="admin-textarea"
                value={form.materials}
                onChange={set('materials')}
                rows={3}
              />
            </div>
            <div className="admin-form-group">
              <label className="admin-label">Shipping Info</label>
              <textarea
                className="admin-textarea"
                value={form.shipping}
                onChange={set('shipping')}
                rows={3}
              />
            </div>
          </div>

          {/* Active toggle */}
          <div className="admin-form-group" style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <input
              type="checkbox"
              id="isActive"
              checked={form.isActive}
              onChange={set('isActive')}
              style={{ width: 16, height: 16 }}
            />
            <label htmlFor="isActive" className="admin-label" style={{ marginBottom: 0 }}>
              Active (visible on storefront)
            </label>
          </div>

          <div className="admin-form-actions">
            <button type="submit" className="admin-btn admin-btn-primary" disabled={saving}>
              {saving ? 'Saving…' : isEdit ? 'Save Changes' : 'Create Product'}
            </button>
            <Link to="/admin/products" className="admin-btn admin-btn-secondary">
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </>
  );
}
