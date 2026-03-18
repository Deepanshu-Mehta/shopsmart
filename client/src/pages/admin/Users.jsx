import { useState, useEffect } from 'react';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5001';

function fmt(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionError, setActionError] = useState('');
  const [updating, setUpdating] = useState(null);
  const [bootstrapSecret, setBootstrapSecret] = useState('');
  const [bootstrapMsg, setBootstrapMsg] = useState('');
  const [bootstrapError, setBootstrapError] = useState('');
  const [promoting, setPromoting] = useState(false);

  useEffect(() => {
    fetch(`${API}/api/admin/users`, { credentials: 'include' })
      .then((r) => (r.ok ? r.json() : Promise.reject(r)))
      .then((data) => {
        setUsers(data);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load users');
        setLoading(false);
      });
  }, []);

  const toggleRole = async (user) => {
    const newRole = user.role === 'ADMIN' ? 'USER' : 'ADMIN';
    const action = newRole === 'ADMIN' ? 'promote' : 'demote';

    if (
      !window.confirm(
        `${action === 'promote' ? 'Promote' : 'Demote'} ${user.email} to ${newRole}?\n\n${
          newRole === 'ADMIN'
            ? 'This user will have full admin access.'
            : 'This user will lose admin access.'
        }`
      )
    )
      return;

    setUpdating(user.id);
    setActionError('');

    try {
      const res = await fetch(`${API}/api/admin/users/${user.id}/role`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole }),
      });

      const data = await res.json();
      if (!res.ok) {
        setActionError(data.error || 'Failed to update role');
      } else {
        setUsers((prev) => prev.map((u) => (u.id === user.id ? { ...u, role: newRole } : u)));
      }
    } catch {
      setActionError('Network error — please try again');
    } finally {
      setUpdating(null);
    }
  };

  const promoteSelf = async (e) => {
    e.preventDefault();
    setPromoting(true);
    setBootstrapError('');
    setBootstrapMsg('');
    try {
      const res = await fetch(`${API}/auth/promote-self`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ secret: bootstrapSecret }),
      });
      const data = await res.json();
      if (!res.ok) {
        setBootstrapError(data.error || 'Promotion failed');
      } else {
        setBootstrapMsg('Promoted to admin! Please refresh the page.');
      }
    } catch {
      setBootstrapError('Network error — please try again');
    } finally {
      setPromoting(false);
      setBootstrapSecret('');
    }
  };

  return (
    <>
      <div className="admin-page-header">
        <h1 className="admin-page-heading">Users</h1>
      </div>

      {error && <div className="admin-error">{error}</div>}
      {actionError && <div className="admin-error">{actionError}</div>}

      <div className="admin-card" style={{ marginBottom: 24, padding: '20px 24px' }}>
        <p style={{ fontSize: 13, color: 'var(--a-text-muted)', marginBottom: 12 }}>
          First-time bootstrap: promote yourself to admin using the{' '}
          <code>ADMIN_BOOTSTRAP_SECRET</code> env var. Only works when no admins exist yet.
        </p>
        <form
          onSubmit={promoteSelf}
          style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}
        >
          <input
            className="admin-input"
            type="password"
            placeholder="Bootstrap secret"
            value={bootstrapSecret}
            onChange={(e) => setBootstrapSecret(e.target.value)}
            style={{ maxWidth: 260 }}
          />
          <button
            type="submit"
            className="admin-btn admin-btn-primary"
            disabled={promoting || !bootstrapSecret}
          >
            {promoting ? '…' : 'Promote Me to Admin'}
          </button>
        </form>
        {bootstrapMsg && (
          <p style={{ color: '#2e7d32', fontSize: 13, marginTop: 8 }}>{bootstrapMsg}</p>
        )}
        {bootstrapError && (
          <p style={{ color: '#c0392b', fontSize: 13, marginTop: 8 }}>{bootstrapError}</p>
        )}
      </div>

      <div className="admin-card">
        <div className="admin-card-header">
          <span className="admin-card-title">All Users</span>
          <span className="admin-stat">{users.length} total</span>
        </div>

        {loading ? (
          <div className="admin-empty">Loading…</div>
        ) : users.length === 0 ? (
          <div className="admin-empty">No users yet</div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td style={{ fontWeight: 500 }}>{u.name || '—'}</td>
                  <td style={{ color: 'var(--a-text-muted)' }}>{u.email}</td>
                  <td>
                    <span
                      className={`admin-badge ${
                        u.role === 'ADMIN' ? 'admin-badge-gold' : 'admin-badge-gray'
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td style={{ color: 'var(--a-text-muted)' }}>{fmt(u.createdAt)}</td>
                  <td>
                    <button
                      className={`admin-btn admin-btn-sm ${
                        u.role === 'ADMIN' ? 'admin-btn-danger' : 'admin-btn-secondary'
                      }`}
                      onClick={() => toggleRole(u)}
                      disabled={updating === u.id}
                    >
                      {updating === u.id
                        ? '…'
                        : u.role === 'ADMIN'
                          ? 'Demote to User'
                          : 'Make Admin'}
                    </button>
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
