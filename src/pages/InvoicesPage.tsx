import { useEffect, useState } from 'react';
import { InvoiceRow, platformApi } from '../api';

export function InvoicesPage() {
  const [rows, setRows] = useState<InvoiceRow[]>([]);
  const [q, setQ] = useState('');
  const [total, setTotal] = useState(0);
  const [error, setError] = useState('');

  const load = (search?: string) => {
    platformApi
      .invoices({ q: search })
      .then((res) => {
        setRows(res.items);
        setTotal(res.total);
      })
      .catch((e) => setError(e instanceof Error ? e.message : 'Load failed'));
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <>
      <h1 style={{ marginTop: 0 }}>Invoices</h1>
      <p style={{ color: 'var(--muted)' }}>All gyms — {total} invoices</p>
      <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
        <input
          placeholder="Gym, member, invoice #…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          style={{ flex: 1 }}
        />
        <button type="button" onClick={() => load(q.trim() || undefined)}>
          Search
        </button>
      </div>
      {error ? <p className="error">{error}</p> : null}
      <div className="card" style={{ overflowX: 'auto' }}>
        <table>
          <thead>
            <tr>
              <th>Invoice</th>
              <th>Gym</th>
              <th>Member</th>
              <th>Total</th>
              <th>Due</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((inv) => (
              <tr key={inv.id}>
                <td>{inv.invoiceNumber}</td>
                <td>{inv.gym.name}</td>
                <td>{inv.member.fullName}</td>
                <td>{inv.totalPkr.toLocaleString()} PKR</td>
                <td>{inv.duePkr.toLocaleString()} PKR</td>
                <td>{inv.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}