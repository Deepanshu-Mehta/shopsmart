import { useState, useEffect } from 'react';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5001';

function fmt(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export default function Newsletter() {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`${API}/api/admin/newsletter`, { credentials: 'include' })
      .then((r) => (r.ok ? r.json() : Promise.reject(r)))
      .then((data) => {
        setSubscribers(data);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load subscribers');
        setLoading(false);
      });
  }, []);

  return (
    <>
      <div className="admin-page-header">
        <h1 className="admin-page-heading">Newsletter</h1>
      </div>

      {error && <div className="admin-error">{error}</div>}

      <div className="admin-card">
        <div className="admin-card-header">
          <span className="admin-card-title">Subscribers</span>
          <span className="admin-stat">{subscribers.length} total</span>
        </div>

        {loading ? (
          <div className="admin-empty">Loading…</div>
        ) : subscribers.length === 0 ? (
          <div className="admin-empty">No subscribers yet</div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Email</th>
                <th>Subscribed</th>
              </tr>
            </thead>
            <tbody>
              {subscribers.map((s, i) => (
                <tr key={s.id}>
                  <td style={{ color: 'var(--a-text-muted)', width: 48 }}>{i + 1}</td>
                  <td>{s.email}</td>
                  <td style={{ color: 'var(--a-text-muted)' }}>{fmt(s.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
