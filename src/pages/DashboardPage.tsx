import { useEffect, useState } from 'react';
import { DashboardStats, platformApi } from '../api';

export function DashboardPage() {
  const [data, setData] = useState<DashboardStats | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    platformApi
      .dashboard()
      .then(setData)
      .catch((e) => setError(e instanceof Error ? e.message : 'Failed to load'));
  }, []);

  return (
    <>
      <h1 style={{ marginTop: 0 }}>Dashboard</h1>
      {error ? <p className="error">{error}</p> : null}
      {!data ? (
        <p style={{ color: 'var(--muted)' }}>Loading…</p>
      ) : (
        <div className="grid">
          <StatCard label="Total gyms" value={data.gyms.total} />
          <StatCard label="Active gyms" value={data.gyms.active} />
          <StatCard label="Members (all gyms)" value={data.members} />
          <StatCard label="Gym owners" value={data.gymOwners} />
          <StatCard label="Invoices (PAID)" value={data.invoices.PAID?.count ?? 0} />
          <StatCard label="Invoices (OVERDUE)" value={data.invoices.OVERDUE?.count ?? 0} />
        </div>
      )}
    </>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="card stat">
      <h3>{value}</h3>
      <p>{label}</p>
    </div>
  );
}