import { FormEvent, useEffect, useState } from 'react';
import { GymRow, platformApi } from '../api';

const emptyForm = {
  gymName: '',
  city: '',
  address: '',
  gymPhone: '',
  ownerFullName: '',
  ownerPhone: '',
  ownerPassword: '',
};

export function GymsPage() {
  const [rows, setRows] = useState<GymRow[]>([]);
  const [q, setQ] = useState('');
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const load = () => {
    platformApi
      .gyms(q.trim() || undefined)
      .then(setRows)
      .catch((e) => setError(e instanceof Error ? e.message : 'Load failed'));
  };

  useEffect(() => {
    load();
  }, []);

  async function onCreate(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await platformApi.createGym(form);
      setForm(emptyForm);
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Create failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <h1 style={{ marginTop: 0 }}>Gyms</h1>
      <p style={{ color: 'var(--muted)' }}>
        Create a gym and its owner login. Owners use the mobile app with phone + password.
      </p>

      <div className="card" style={{ marginBottom: 20 }}>
        <h2 style={{ marginTop: 0, fontSize: '1.1rem' }}>New gym + owner</h2>
        <form className="form-grid" onSubmit={onCreate}>
          {Object.entries({
            gymName: 'Gym name',
            city: 'City',
            address: 'Address',
            gymPhone: 'Gym phone',
            ownerFullName: 'Owner name',
            ownerPhone: 'Owner phone (login)',
            ownerPassword: 'Owner password',
          }).map(([key, label]) => (
            <label key={key}>
              {label}
              <input
                value={(form as Record<string, string>)[key]}
                onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                required={key === 'gymName' || key === 'ownerFullName' || key === 'ownerPhone' || key === 'ownerPassword'}
              />
            </label>
          ))}
          <div className="full">
            <button type="submit" disabled={loading}>
              {loading ? 'Creating…' : 'Create gym admin'}
            </button>
          </div>
        </form>
        {error ? <p className="error">{error}</p> : null}
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
        <input
          placeholder="Search gyms…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          style={{ flex: 1 }}
        />
        <button type="button" onClick={load}>
          Search
        </button>
      </div>

      <div className="card" style={{ overflowX: 'auto' }}>
        <table>
          <thead>
            <tr>
              <th>Gym</th>
              <th>City</th>
              <th>Owner</th>
              <th>Members</th>
              <th>Status</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {rows.map((g) => (
              <tr key={g.id}>
                <td>{g.name}</td>
                <td>{g.city || '—'}</td>
                <td>
                  {g.owner ? `${g.owner.fullName} · ${g.owner.phone}` : '—'}
                </td>
                <td>{g.memberCount}</td>
                <td>{g.isActive ? 'Active' : 'Off'}</td>
                <td>
                  <button
                    type="button"
                    className="ghost"
                    onClick={() =>
                      void platformApi.setGymActive(g.id, !g.isActive).then(load)
                    }
                  >
                    {g.isActive ? 'Disable' : 'Enable'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}