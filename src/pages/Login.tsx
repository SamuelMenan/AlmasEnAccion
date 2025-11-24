
import { useState } from 'react';
import { Input, Button } from '@/components/common';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();
  const auth = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [touched, setTouched] = useState<{ email?: boolean; password?: boolean }>({});
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const validate = {
    email: (v: string) => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v),
    password: (v: string) => v.length >= 6,
  };
  const isValid = (key: 'email' | 'password') => validate[key](key === 'email' ? email : password);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await auth.login(email, password);
      navigate('/activities');
    } catch (err: unknown) {
      let message = 'Error de autenticación';
      if (typeof err === 'object' && err !== null) {
        const anyErr = err as { response?: { data?: { message?: string } } };
        message = anyErr.response?.data?.message || message;
      }
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center min-h-[100vh] bg-gray-50">
      <div className="h-20" />
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 mx-auto">
        <h1 className="text-3xl font-bold mb-2 text-center">Iniciar Sesión</h1>
        <p className="text-gray-500 text-center mb-6">Inicia sesión para acceder a tu cuenta.</p>
        <form onSubmit={onSubmit} className="space-y-6">
          <Input
            name="email"
            label="Correo electrónico"
            type="email"
            value={email}
            onChange={v => { setEmail(v); setTouched(t => ({ ...t, email: true })); }}
            placeholder="Tu correo"
            required
            className={touched.email ? (isValid('email') ? 'ring-2 ring-green-400' : 'ring-2 ring-red-400') : ''}
          />
          <div className="relative">
            <Input
              name="password"
              label="Contraseña"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={v => { setPassword(v); setTouched(t => ({ ...t, password: true })); }}
              placeholder="Tu contraseña"
              required
              className={touched.password ? (isValid('password') ? 'ring-2 ring-green-400' : 'ring-2 ring-red-400') : ''}
            />
            <button
              type="button"
              className="absolute right-3 top-9 text-gray-400 hover:text-gray-700"
              tabIndex={-1}
              onClick={() => setShowPassword(v => !v)}
              aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            >
              <span className="material-icons" style={{ fontSize: 22 }}>
                {showPassword ? 'visibility_off' : 'visibility'}
              </span>
            </button>
          </div>
          {error && <p className="text-red-600 text-sm text-center">{error}</p>}
          <Button
            variant="primary"
            size="md"
            loading={loading}
            type="submit"
            disabled={loading || !isValid('email') || !isValid('password')}
            className="w-full mt-2 shadow-lg hover:shadow-xl transition-all duration-200"
          >
            {loading ? 'Verificando…' : 'Entrar'}
          </Button>
          <div className="flex flex-col items-center gap-2 mt-2">
            <button
              type="button"
              className="text-primary-600 underline text-sm"
              onClick={() => alert('Funcionalidad próximamente')}
            >
              ¿Olvidaste tu contraseña?
            </button>
            <span className="text-sm text-gray-500">
              ¿No tienes cuenta?{' '}
              <button type="button" className="text-primary-600 underline" onClick={() => navigate('/register')}>Regístrate aquí</button>
            </span>
          </div>
        </form>
      </div>
    </div>
  );
}
