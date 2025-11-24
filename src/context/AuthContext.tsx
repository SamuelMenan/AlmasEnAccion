import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';
import { api } from '../services/api';

type AuthState = {
  token: string | null;
  role: string | null;
  user: any | null;
  roles: string[];
  loading: boolean;
  activeRole: string | null;
};

type AuthContextType = AuthState & {
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  refresh: () => Promise<void>;
  hasRole: (role: string) => boolean;
  register: (payload: { firstName: string; lastName?: string; email: string; password: string; phone?: string; address?: string; skills?: string; role: 'VOLUNTARIO' | 'COORDINADOR'; }) => Promise<void>;
  setActiveRole: (role: string | null) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>(() => {
    const token = localStorage.getItem('aea_token');
    const role = localStorage.getItem('aea_role');
    const activeRole = localStorage.getItem('aea_active_role');
    return { token, role, user: null, roles: [], loading: !!token, activeRole };
  });

  const normalizeRole = (r: string) => {
    const s = (r || '').toUpperCase();
    if (s === 'COORDINATOR') return 'COORDINADOR';
    if (s === 'VOLUNTEER') return 'VOLUNTARIO';
    return s;
  };

  // refresh debe ir antes del useEffect
  const refresh = useCallback(async (forcedToken?: string) => {
    const t = forcedToken ?? state.token;
    console.log('[AuthContext] refresh called. token:', t);
    if (!t) return;
    setState(s => ({ ...s, loading: true }));
    try {
      const me = await api.me(t);
      console.log('[AuthContext] api.me result:', me);
      setState(s => {
        let roles: string[] = [];
        const raw = (me as any)?.roles;
        const roleFromMe = (me as any)?.role ? normalizeRole((me as any).role) : null;
        if (Array.isArray(raw)) {
          roles = raw.map((r: any) => {
            if (typeof r === 'string') return normalizeRole(r);
            const val = r?.name ?? r?.role ?? r?.authority ?? r?.rolename ?? r?.value ?? r?.code;
            return normalizeRole(String(val || ''));
          }).filter(Boolean);
        } else if (roleFromMe) {
          roles = [roleFromMe];
        } else if (s.role) {
          roles = [normalizeRole(s.role)];
        }
        const stored = localStorage.getItem('aea_active_role');
        const storedNorm = stored ? normalizeRole(stored) : null;
        const activeRole = storedNorm && roles.includes(storedNorm) ? storedNorm : (roles.length ? roles[0] : null);
        return { ...s, user: me, roles, role: roleFromMe ?? s.role, loading: false, activeRole };
      });
    } catch (e) {
      console.log('[AuthContext] api.me error:', e);
      setState(s => ({ ...s, user: null, loading: false }));
    }
  }, [state.token]);

  useEffect(() => {
    if (state.token) {
      localStorage.setItem('aea_token', state.token);
      // Refresca el usuario automáticamente cuando hay token
      refresh();
    } else {
      localStorage.removeItem('aea_token');
      setState(s => ({ ...s, user: null, loading: false }));
    }
    if (state.role) localStorage.setItem('aea_role', state.role);
  }, [state.token, state.role, refresh]);

  useEffect(() => {
    if (state.activeRole) {
      localStorage.setItem('aea_active_role', state.activeRole);
    } else {
      localStorage.removeItem('aea_active_role');
    }
  }, [state.activeRole]);

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === 'aea_token') {
        setState(s => ({ ...s, token: e.newValue }));
      }
      if (e.key === 'aea_role') {
        setState(s => ({ ...s, role: e.newValue }));
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setState(s => ({ ...s, loading: true }));
    const res = await api.login({ email, password });
    console.log('[AuthContext] login result:', res);
      setState(s => ({ ...s, token: res.token, role: res.role, loading: true }));
      // No llamar a refresh aquí, el useEffect lo hará automáticamente
  }, [refresh]);

  const logout = useCallback(() => {
    setState({ token: null, role: null, user: null, roles: [], activeRole: null, loading: false });
    localStorage.removeItem('aea_token');
    localStorage.removeItem('aea_role');
  }, []);

  const register = useCallback(async (payload: { firstName: string; lastName?: string; email: string; password: string; phone?: string; address?: string; skills?: string; role: 'VOLUNTARIO' | 'COORDINADOR'; }) => {
    await api.register(payload);
  }, []);

  const setActiveRole = useCallback((role: string | null) => {
    setState(s => ({ ...s, activeRole: role }));
  }, []);

  const isAuthenticated = !!state.token;
  const hasRole = useCallback((role: string) => Array.isArray(state.roles) && state.roles.includes(normalizeRole(role)), [state.roles]);

  const value = useMemo(
    () => ({ ...state, isAuthenticated, login, logout, refresh, hasRole, register, setActiveRole }),
    [state, isAuthenticated, login, logout, refresh, hasRole, register, setActiveRole]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('AuthContext not found');
  return ctx;
}
