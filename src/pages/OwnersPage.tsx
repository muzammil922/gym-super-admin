import { useEffect, useState } from 'react';
import { OwnerRow, platformApi } from '../api';

export function OwnersPage() {
  const [rows, setRows] = useState<OwnerRow[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    platformApi
      .owners()
      .then(setRows)
      .catch((e) => setError(e instanceof Error ? e.message : 'Load failed'));
  }, []);

  return (
    <>
      <h1 style={{ marginTop: 0 }}>Gym admins (owners)</h1>
      <p style={{ color: 'var(--muted)' }}>All owner accounts that can log into the mobile app.</p>
      {error ? <p className="error">{error}</p> : null}
      <div className="card" style={{ overflowX: 'auto' }}>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Phone</th>
              <th>Gym</th>
              <th>City</th>
              <th>Login</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((o) => (
              <tr key={o.id}>
                <td>{o.fullName}</td>
                <td>{o.phone}</td>
                <td>{o.gym.name}</td>
                <td>{o.gym.city || '—'}</td>
                <td>{o.isActive && o.gym.isActive ? 'Allowed' : 'Blocked'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}