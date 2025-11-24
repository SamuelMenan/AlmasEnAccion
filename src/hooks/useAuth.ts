import { useEffect, useState, useCallback } from 'react';
import { login as apiLogin, register as apiRegister, getMe, JwtResponse, LoginRequest, RegisterRequest, UserProfile } from '@/lib/api';

interface AuthState {
  token: string | null;
  user: UserProfile | null;
  loading: boolean;
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({ token: localStorage.getItem('auth_token'), user: null, loading: false });
  const [initialized, setInitialized] = useState(false);

  // Decode roles from cached user or token (simple JWT decode for planning)
  const roles = state.user?.roles?.map(r => r.name) || [];

  const fetchMe = useCallback(async () => {
    if (!state.token) return;
    try {
      setState(s => ({ ...s, loading: true }));
      const profile = await getMe();
      setState(s => ({ ...s, user: profile, loading: false }));
    } catch (e) {
      console.error(e);
      setState(s => ({ ...s, loading: false }));
    }
  }, [state.token]);

  useEffect(() => {
    if (state.token && !initialized) {
      fetchMe();
      setInitialized(true);
    }
  }, [state.token, initialized, fetchMe]);

  const login = async (credentials: LoginRequest) => {
    setState(s => ({ ...s, loading: true }));
    const resp: JwtResponse = await apiLogin(credentials);
    localStorage.setItem('auth_token', resp.token);
    setState({ token: resp.token, user: null, loading: false });
    await fetchMe();
  };

  const register = async (payload: RegisterRequest) => {
    await apiRegister(payload);
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    setState({ token: null, user: null, loading: false });
  };

  const hasRole = (role: string) => roles.includes(role);

  return {
    ...state,
    isAuthenticated: !!state.token,
    roles,
    login,
    register,
    logout,
    hasRole,
    refreshProfile: fetchMe,
  };
}
