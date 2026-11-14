const API = (import.meta.env.VITE_API_URL || 'http://localhost:3000/api').replace(/\/$/, '');

const TOKEN_KEY = 'if_platform_token';

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string | null) {
  if (!token) localStorage.removeItem(TOKEN_KEY);
  else localStorage.setItem(TOKEN_KEY, token);
}

export async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const headers = new Headers(init?.headers);
  headers.set('Content-Type', 'application/json');
  const token = getToken();
  if (token) headers.set('Authorization', `Bearer ${token}`);

  const res = await fetch(`${API}${path.startsWith('/') ? path : `/${path}`}`, {
    ...init,
    headers,
  });
  const text = await res.text();
  const data = text ? (JSON.parse(text) as T) : ({} as T);
  if (!res.ok) {
    const msg =
      typeof data === 'object' && data && 'message' in data
        ? String((data as { message: unknown }).message)
        : res.statusText;
    throw new Error(msg || 'Request failed');
  }
  return data;
}

export type LoginResponse = {
  accessToken: string;
  admin: { id: string; email: string; phone: string; fullName: string };
};

export type DashboardStats = {
  gyms: { total: number; active: number };
  members: number;
  gymOwners: number;
  invoices: Record<string, { count: number; totalPkr: number; paidPkr: number; duePkr: number }>;
};

export type GymRow = {
  id: string;
  name: string;
  phone?: string;
  city?: string;
  isActive: boolean;
  memberCount: number;
  owner?: { fullName: string; phone: string; isActive: boolean } | null;
};

export type OwnerRow = {
  id: string;
  fullName: string;
  phone: string;
  isActive: boolean;
  gym: { id: string; name: string; city?: string; isActive: boolean };
};

export type InvoiceRow = {
  id: string;
  invoiceNumber: string;
  status: string;
  gym: { name: string; city?: string };
  member: { fullName: string; phone?: string };
  totalPkr: number;
  duePkr: number;
  issueDate: string;
};

export const platformApi = {
  login: (email: string, password: string) =>
    api<LoginResponse>('/platform/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
  dashboard: () => api<DashboardStats>('/platform/dashboard'),
  gyms: (q?: string) => api<GymRow[]>(`/platform/gyms${q ? `?q=${encodeURIComponent(q)}` : ''}`),
  owners: () => api<OwnerRow[]>('/platform/owners'),
  createGym: (body: Record<string, string>) =>
    api('/platform/gyms', { method: 'POST', body: JSON.stringify(body) }),
  setGymActive: (id: string, isActive: boolean) =>
    api(`/platform/gyms/${id}/active`, {
      method: 'PATCH',
      body: JSON.stringify({ isActive }),
    }),
  invoices: (params?: { q?: string; page?: number }) => {
    const sp = new URLSearchParams();
    if (params?.q) sp.set('q', params.q);
    if (params?.page) sp.set('page', String(params.page));
    const q = sp.toString();
    return api<{ items: InvoiceRow[]; total: number; page: number }>(
      `/platform/invoices${q ? `?${q}` : ''}`,
    );
  },
};