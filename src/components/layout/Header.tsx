
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import { NotificationBell } from '@/components/common';


export const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const auth = useAuth();
  const displayName = `${auth.user?.firstName ?? ''}${auth.user?.lastName ? ' ' + auth.user.lastName : ''}`.trim() || auth.user?.email || '';
  const hasAvatar = !!auth.user?.avatarUrl;
  const avatarSrc = hasAvatar ? `${import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1'}/profile/avatar/${auth.user?.avatarUrl}` : '';
  const initials = (displayName || '').split(' ').filter(Boolean).slice(0, 2).map(s => s[0]?.toUpperCase()).join('') || (auth.user?.email?.[0]?.toUpperCase() ?? 'U');
  const MAX_AVATAR_BYTES = 512 * 1024;
  const [avatarIsValid, setAvatarIsValid] = useState(true);
  const [avatarAspectValid, setAvatarAspectValid] = useState(true);
  const [avatarBlobUrl, setAvatarBlobUrl] = useState<string>('');

  useEffect(() => {
    console.log('[Header] auth change', {
      isAuthenticated: auth.isAuthenticated,
      loading: auth.loading,
      user: auth.user,
      roles: auth.roles,
    });
  }, [auth.isAuthenticated, auth.loading, auth.user, auth.roles]);

  useEffect(() => {
    let cancelled = false;
    let currentUrl = '';
    const run = async () => {
      if (!hasAvatar || !auth.user?.avatarUrl) {
        if (!cancelled) { setAvatarIsValid(true); setAvatarBlobUrl(''); }
        return;
      }
      try {
        const res = await api.get(`/profile/avatar/${auth.user.avatarUrl}`, { responseType: 'blob' });
        const blob = res.data as Blob;
        if (blob && blob.size && blob.size > MAX_AVATAR_BYTES) {
          if (!cancelled) { setAvatarIsValid(false); setAvatarBlobUrl(''); }
          return;
        }
        const url = URL.createObjectURL(blob);
        currentUrl = url;
        if (!cancelled) { setAvatarIsValid(true); setAvatarBlobUrl(url); }
      } catch {
        if (!cancelled) { setAvatarIsValid(false); setAvatarBlobUrl(''); }
      }
    };
    run();
    return () => { cancelled = true; if (currentUrl) URL.revokeObjectURL(currentUrl); };
  }, [hasAvatar, auth.user?.avatarUrl]);

  const navigation: { name: string; href: string }[] = [];

  const isActive = (path: string) => location.pathname === path;

  if (auth.loading) {
    return (
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-center">
          <span className="text-gray-400 text-sm">Cargando...</span>
        </div>
      </header>
    );
  }

  return (
    <header className="bg-white shadow-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-primary-600">
              AlmasEnAcción
            </Link>
          </div>

          <nav className="hidden md:flex space-x-8 items-center">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`h-10 px-3 inline-flex items-center rounded-md text-sm font-medium transition-colors ${
                  isActive(item.href)
                    ? 'text-primary-600 bg-primary-50'
                    : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
                }`}
              >
                {item.name}
              </Link>
            ))}
            {auth.isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <NotificationBell />
                <Link
                  to="/activities"
                  className={`h-10 px-3 inline-flex items-center rounded-md text-sm font-medium transition-colors ${
                    isActive('/activities')
                      ? 'text-primary-600 bg-primary-50'
                      : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
                  }`}
                >Actividades</Link>
                
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => navigate('/profile')}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') navigate('/profile'); }}
                  aria-label={`Abrir perfil de ${displayName || 'usuario'}`}
                  className={`group flex items-center gap-2 mr-4 pl-2 pr-3 h-10 rounded-md ring-1 ring-primary-200 bg-[#007bff] text-white cursor-pointer transition-all focus:ring-primary-300 hover:ring-primary-300`}
                  style={{ zIndex: 1 }}
                >
                  {hasAvatar && avatarIsValid && avatarBlobUrl ? (
                    <div className="w-6 h-6 md:w-8 md:h-8 rounded-full overflow-hidden bg-white/20 flex-shrink-0">
                      <img
                        src={avatarBlobUrl}
                        alt={`Foto de perfil de ${displayName || 'usuario'}`}
                        className="w-full h-full object-cover"
                        decoding="async"
                        loading="eager"
                        onLoad={(e) => {
                          const img = e.currentTarget;
                          const ratio = img.naturalWidth / img.naturalHeight;
                          setAvatarAspectValid(Math.abs(ratio - 1) < 0.15);
                        }}
                        onError={() => setAvatarIsValid(false)}
                        style={{ transition: 'transform 0.2s ease' }}
                      />
                    </div>
                  ) : (
                    <span
                      className="w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center font-semibold text-white bg-white/10"
                      style={{ transition: 'all 0.2s ease' }}
                    >{initials}</span>
                  )}
                  <span
                    className="ml-2 font-medium text-sm text-white group-hover:brightness-110 group-focus:brightness-110 max-w-[150px] truncate max-[480px]:hidden"
                    style={{ fontFamily: 'Roboto, system-ui, sans-serif' }}
                  >{displayName}</span>
                </div>
                <Link
                  to="/profile"
                  aria-label="Perfil"
                  className={`h-10 px-3 inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors ${
                    isActive('/profile')
                      ? 'text-primary-600 bg-primary-50 ring-1 ring-primary-200'
                      : 'text-gray-700 hover:text-primary-600 hover:bg-primary-50 hover:ring-1 hover:ring-primary-200'
                  }`}
                ><span className="material-icons align-middle" style={{ fontSize: 20 }}>settings</span></Link>
                
                <button
                  onClick={() => { auth.logout(); navigate('/'); }}
                  className="h-10 px-3 inline-flex items-center rounded-md text-sm font-medium border border-red-500 text-red-600 hover:bg-red-50 transition-colors"
                >Cerrar sesión</button>
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive('/login')
                      ? 'text-primary-600 bg-primary-50'
                      : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
                  }`}
                >Iniciar Sesión</Link>
                <Link
                  to="/register"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive('/register')
                      ? 'text-primary-600 bg-primary-50'
                      : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
                  }`}
                >Registrarse</Link>
              </>
            )}
          </nav>

          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-primary-600 p-2"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`h-10 flex items-center px-3 rounded-md text-base font-medium transition-colors ${
                    isActive(item.href)
                      ? 'text-primary-600 bg-primary-50'
                      : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              {auth.isAuthenticated ? (
                <>
                  <Link
                    to="/activities"
                    className={`h-10 flex items-center px-3 rounded-md text-base font-medium transition-colors ${
                      isActive('/activities')
                        ? 'text-primary-600 bg-primary-50'
                        : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >Actividades</Link>
                  <Link
                    to="/profile"
                    aria-label="Perfil"
                    className={`h-10 flex items-center px-3 rounded-md text-base font-medium transition-colors ${
                      isActive('/profile')
                        ? 'text-primary-600 bg-primary-50'
                        : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  ><span className="material-icons align-middle" style={{ fontSize: 20 }}>settings</span></Link>
                  <button
                    onClick={() => { auth.logout(); setIsMenuOpen(false); navigate('/'); }}
                    className="block w-full text-left px-3 py-2 rounded-md text-base font-medium border border-red-500 text-red-600 hover:bg-red-50 transition-colors"
                  >Cerrar sesión</button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className={`h-10 flex items-center px-3 rounded-md text-base font-medium transition-colors ${
                      isActive('/login')
                        ? 'text-primary-600 bg-primary-50'
                        : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >Iniciar Sesión</Link>
                  <Link
                    to="/register"
                    className={`h-10 flex items-center px-3 rounded-md text-base font-medium transition-colors ${
                      isActive('/register')
                        ? 'text-primary-600 bg-primary-50'
                        : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >Registrarse</Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
