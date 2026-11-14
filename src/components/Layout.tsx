import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { setToken } from '../api';

export function Layout() {
  const navigate = useNavigate();

  return (
    <div className="shell">
      <aside className="sidebar">
        <div className="brand">IronForge</div>
        <div className="brand-sub">Platform super admin</div>
        <nav className="nav">
          <NavLink to="/" end>
            Dashboard
          </NavLink>
          <NavLink to="/gyms">Gyms</NavLink>
          <NavLink to="/owners">Gym admins</NavLink>
          <NavLink to="/invoices">Invoices</NavLink>
        </nav>
        <button
          type="button"
          className="ghost"
          style={{ marginTop: 24, width: '100%' }}
          onClick={() => {
            setToken(null);
            navigate('/login');
          }}
        >
          Logout
        </button>
      </aside>
      <main className="main">
        <Outlet />
      </main>
    </div>
  );
}