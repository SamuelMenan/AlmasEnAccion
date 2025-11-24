import axios, { AxiosInstance, AxiosRequestConfig, AxiosRequestHeaders, InternalAxiosRequestConfig, AxiosHeaders } from 'axios';

// Backend base URL configurable via Vite env (VITE_API_URL). Fallback a proxy local
const BASE_URL = import.meta.env.VITE_API_URL ?? '/api/v1';

// ---- Types (reflecting backend models / DTOs minimal subset) ----
export interface JwtResponse {
  token: string;
  expiresAt: string;
  email: string;
  roles: string[]; // assuming backend includes roles array
}

export interface LoginRequest { email: string; password: string; }
export interface RegisterRequest { firstName: string; lastName?: string; email: string; password: string; phone?: string; address?: string; role: 'VOLUNTARIO' | 'COORDINADOR'; }

export interface UserProfile {
  id: string;
  firstName: string; // antes: name
  lastName: string;
  email: string;
  phone?: string;
  roles: { name: string }[];
  avatarUrl?: string;
}

export interface UpdateProfileRequest { firstName?: string; lastName?: string; phone?: string; }

export interface Activity {
  id: string;
  name: string;
  description: string;
  date: string; // ISO
  location: string;
  city?: string;
  department?: string;
  type?: string;
  project?: string;
  durationHours?: number;
  capacity: number;
  creatorId?: string;
}

export interface ActivityRequest { name: string; description: string; scheduledAt: string; location: string; city?: string; department?: string; type?: string; project?: string; durationHours?: number; capacity: number; }

export interface Enrollment { id: string; activityId: string; userId: string; createdAt: string; }

// ---- Axios instance with auth interceptor ----
const api: AxiosInstance = axios.create({ baseURL: BASE_URL });

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem('aea_token');
  if (token) {
    // Ensure headers is an AxiosHeaders instance we can mutate, then assign Authorization.
    config.headers = config.headers ?? new AxiosHeaders();
    (config.headers as AxiosHeaders).set('Authorization', `Bearer ${token}`);
  }
  return config;
});

// ---- Auth endpoints ----
export async function register(data: RegisterRequest): Promise<void> {
  await api.post('/auth/register', data);
}

export async function verifyAccount(token: string): Promise<string> {
  const res = await api.get('/auth/verify', { params: { token } });
  return res.data;
}

export async function login(data: LoginRequest): Promise<JwtResponse> {
  const res = await api.post<JwtResponse>('/auth/login', data);
  return res.data;
}

// ---- Profile ----
export async function getMe(): Promise<UserProfile> {
  const res = await api.get<UserProfile>('/profile/me');
  return res.data;
}

export async function updateMe(payload: UpdateProfileRequest, avatarFile?: File): Promise<UserProfile> {
  const formData = new FormData();
  // Siempre incluir el campo 'data' como string
  formData.append('data', JSON.stringify(payload));
  if (avatarFile instanceof File) {
    formData.append('avatar', avatarFile);
  }
  // No enviar ningún header Content-Type, Axios lo gestiona automáticamente
  const res = await api.put<UserProfile>('/profile/me', formData);
  return res.data;
}

// ---- Activities ----
export async function listActivities(): Promise<Activity[]> {
  const res = await api.get<any[]>('/activities');
  return res.data.map(a => ({
    id: a.id,
    name: a.name,
    description: a.description,
    date: a.scheduledAt,
    location: a.location,
    city: a.city,
    department: a.department,
    type: a.type,
    project: a.project,
    durationHours: a.durationHours,
    capacity: a.capacity,
    creatorId: a.createdById,
  }));
}

export async function createActivity(payload: ActivityRequest): Promise<Activity> {
  const body = {
    name: payload.name,
    description: payload.description,
    scheduledAt: payload.scheduledAt,
    location: payload.location,
    city: payload.city,
    department: payload.department,
    type: payload.type,
    project: payload.project,
    durationHours: payload.durationHours,
    capacity: payload.capacity,
  };
  const res = await api.post<any>('/activities', body);
  const a = res.data;
  return {
    id: a.id,
    name: a.name,
    description: a.description,
    date: a.scheduledAt,
    location: a.location,
    city: a.city,
    department: a.department,
    type: a.type,
    project: a.project,
    durationHours: a.durationHours,
    capacity: a.capacity,
    creatorId: a.createdById,
  };
}

export async function enroll(activityId: string): Promise<Enrollment> {
  const res = await api.post<Enrollment>(`/activities/${activityId}/enroll`);
  return res.data;
}

export async function unenroll(activityId: string, reason?: string): Promise<void> {
  await api.delete(`/activities/${activityId}/enroll`, { params: { reason } });
}

export async function adminUnenroll(activityId: string, userId: string, reason?: string): Promise<void> {
  await api.delete(`/activities/${activityId}/unenroll/${userId}`, { params: { reason } });
}

// ---- Roles ----
export async function updateRole(role: 'VOLUNTARIO' | 'COORDINADOR'): Promise<{ role: string; roles: string[] }> {
  const res = await api.put<{ role: string; roles: string[] }>(`/profile/role`, { role });
  return res.data;
}

export default api;
export async function getAvailability(activityId: string): Promise<{ capacity: number; enrolled: number; available: number }> {
  const res = await api.get<{ capacity: number; enrolled: number; available: number }>(`/activities/${activityId}/availability`);
  return res.data;
}

export async function isEnrolled(activityId: string): Promise<boolean> {
  try {
    const mine = await myEnrollments();
    return mine.some(e => e.activityId === activityId);
  } catch {
    return false;
  }
}
export async function myEnrollments(): Promise<Array<{ id: string; activityId: string; createdAt: string; activity: Activity }>> {
  const res = await api.get<any[]>(`/enrollments/me`);
  return res.data.map(it => ({ id: it.id, activityId: it.activityId, createdAt: it.createdAt, activity: {
    id: it.activity.id,
    name: it.activity.name,
    description: it.activity.description,
    date: it.activity.scheduledAt,
    location: it.activity.location,
    city: it.activity.city,
    department: it.activity.department,
    capacity: it.activity.capacity,
    creatorId: it.activity.createdById,
  } }));
}

export async function listVolunteers(params?: { q?: string }): Promise<Array<{ id: string; name: string; email: string; address?: string }>> {
  const res = await api.get(`/volunteers`, { params });
  return res.data;
}

export async function assignVolunteer(activityId: string, userId: string): Promise<Enrollment> {
  const res = await api.post<Enrollment>(`/activities/${activityId}/assign/${userId}`);
  return res.data;
}

export async function assignVolunteerByEmail(activityId: string, email: string): Promise<Enrollment> {
  const res = await api.post<Enrollment>(`/activities/${activityId}/assignByEmail`, { email });
  return res.data;
}

export async function listEnrollmentsByActivity(activityId: string): Promise<Array<{ enrollmentId: string; userId: string; name: string; email: string; attended: boolean; attendedAt?: string }>> {
  const res = await api.get<any[]>(`/activities/${activityId}/enrollments`);
  return res.data.map((it: any) => ({ enrollmentId: it.enrollmentId, userId: it.userId, name: it.name, email: it.email, attended: it.attended, attendedAt: it.attendedAt }));
}

export async function markAttendance(enrollmentId: string): Promise<{ attended: boolean; attendedAt: string }> {
  const res = await api.post<any>(`/activities/attendance/${enrollmentId}/mark`);
  return { attended: res.data.attended, attendedAt: res.data.attendedAt };
}
