import { Navigate, Route, Routes } from 'react-router-dom';
import { getToken } from './api';
import { Layout } from './components/Layout';
import { DashboardPage } from './pages/DashboardPage';
import { GymsPage } from './pages/GymsPage';
import { InvoicesPage } from './pages/InvoicesPage';
import { LoginPage } from './pages/LoginPage';
import { OwnersPage } from './pages/OwnersPage';

function RequireAuth({ children }: { children: React.ReactNode }) {
  if (!getToken()) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/*"
        element={
          <RequireAuth>
            <Layout />
          </RequireAuth>
        }
      >
        <Route index element={<DashboardPage />} />
        <Route path="gyms" element={<GymsPage />} />
        <Route path="owners" element={<OwnersPage />} />
        <Route path="invoices" element={<InvoicesPage />} />
      </Route>
    </Routes>
  );
}