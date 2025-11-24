export const API_URL = import.meta.env.VITE_API_URL ?? '/api/v1';

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Error ${res.status}`);
  }
  const ct = res.headers.get('content-type') || '';
  return ct.includes('application/json') ? (await res.json()) as T : (await res.text() as unknown as T);
}

export const api = {
  register(data: { firstName: string; lastName?: string; email: string; password: string; phone?: string; address?: string; skills?: string; }) {
    return request<void>('/auth/register', { method: 'POST', body: JSON.stringify(data) });
  },
  verify(token: string) {
    return request<string>(`/auth/verify?token=${encodeURIComponent(token)}`);
  },
  login(data: { email: string; password: string; }) {
    return request<{ token: string; role: string }>('/auth/login', { method: 'POST', body: JSON.stringify(data) });
  },
  me(token: string) {
    return request<any>('/profile/me', { headers: { Authorization: `Bearer ${token}` } });
  },
  updateProfile(token: string, data: { firstName?: string; lastName?: string; phone?: string; address?: string; skills?: string; }) {
    return request<any>('/profile/me', { method: 'PUT', headers: { Authorization: `Bearer ${token}` }, body: JSON.stringify(data) });
  },
  listActivities() {
    return request<any[]>('/activities');
  },
  createActivity(token: string, data: { name: string; description?: string; scheduledAt: string; location?: string; capacity: number; }) {
    return request<any>('/activities', { method: 'POST', headers: { Authorization: `Bearer ${token}` }, body: JSON.stringify(data) });
  },
  enroll(token: string, id: string) {
    return request<any>(`/activities/${id}/enroll`, { method: 'POST', headers: { Authorization: `Bearer ${token}` } });
  },
};

