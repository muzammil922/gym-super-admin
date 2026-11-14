import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { platformApi, setToken } from '../api';

export function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await platformApi.login(email.trim(), password);
      setToken(res.accessToken);
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-wrap">
      <form className="card login-card" onSubmit={onSubmit}>
        <h1 style={{ marginTop: 0 }}>Super admin login</h1>
        <p style={{ color: 'var(--muted)', marginTop: 0 }}>
          Manage all gyms, owners, and invoices. Mobile app is separate.
        </p>
        <label style={{ display: 'block', marginBottom: 12 }}>
          <span style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>Email or phone</span>
          <input value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="username" />
        </label>
        <label style={{ display: 'block', marginBottom: 12 }}>
          <span style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>Password</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />
        </label>
        {error ? <div className="error">{error}</div> : null}
        <button type="submit" disabled={loading} style={{ width: '100%', marginTop: 8 }}>
          {loading ? 'Signing in…' : 'Login'}
        </button>
      </form>
    </div>
  );
}