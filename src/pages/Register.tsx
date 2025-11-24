
import { useState } from 'react';
import { Input, Button } from '@/components/common';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';


export default function Register() {
  const navigate = useNavigate();
  const auth = useAuth();

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phone: '',
    address: '',
    role: 'VOLUNTARIO'
  });
  const [touched, setTouched] = useState<{ [k: string]: boolean }>({});
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const update = (key: string, value: string) => {
    setForm(f => ({ ...f, [key]: value }));
    setTouched(t => ({ ...t, [key]: true }));
  };

  // Validaciones simples
  const validate = {
    firstName: (v: string) => v.length > 1,
    lastName: (v: string) => v.length > 1,
    email: (v: string) => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v),
    password: (v: string) => v.length >= 6,
    phone: (v: string) => v.length >= 8,
    address: (v: string) => v.length > 3,
    role: (v: string) => v === 'VOLUNTARIO' || v === 'COORDINADOR'
  };
  const isValid = (key: string) => validate[key as keyof typeof validate]?.(form[key as keyof typeof form]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await auth.register(form);
      setSuccess(true);
    } catch (err: unknown) {
      let message = 'Error en registro';
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
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-8 mx-auto">
        <h1 className="text-3xl font-bold mb-2 text-center">Crea tu cuenta</h1>
        <p className="text-gray-500 text-center mb-6">Regístrate para acceder a oportunidades de voluntariado y conectar con la comunidad.</p>
        {success ? (
          <div className="space-y-4 text-center">
            <p className="text-green-700">Registro aceptado. Revisa tu correo para activar la cuenta.</p>
            <Button variant="primary" size="md" onClick={() => navigate('/login')}>Ir a Login</Button>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                name="firstName"
                label="Nombre"
                value={form.firstName}
                onChange={v => update('firstName', v)}
                placeholder="Ej: Juan"
                required
                className={touched.firstName ? (isValid('firstName') ? 'ring-2 ring-green-400' : 'ring-2 ring-red-400') : ''}
              />
              <Input
                name="lastName"
                label="Apellido"
                value={form.lastName}
                onChange={v => update('lastName', v)}
                placeholder="Ej: Pérez"
                required
                className={touched.lastName ? (isValid('lastName') ? 'ring-2 ring-green-400' : 'ring-2 ring-red-400') : ''}
              />
              <Input
                name="email"
                label="Correo electrónico"
                type="email"
                value={form.email}
                onChange={v => update('email', v)}
                placeholder="Ej: juan@email.com"
                required
                className={touched.email ? (isValid('email') ? 'ring-2 ring-green-400' : 'ring-2 ring-red-400') : ''}
              />
              <Input
                name="phone"
                label="Teléfono"
                value={form.phone}
                onChange={v => update('phone', v)}
                placeholder="Ej: 5551234567"
                required
                className={touched.phone ? (isValid('phone') ? 'ring-2 ring-green-400' : 'ring-2 ring-red-400') : ''}
              />
            </div>
            <div className="relative">
              <Input
                name="password"
                label="Contraseña"
                type={showPassword ? 'text' : 'password'}
                value={form.password}
                onChange={v => update('password', v)}
                placeholder="Mínimo 6 caracteres"
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
          <Input
            name="address"
            label="Dirección"
            value={form.address}
            onChange={v => update('address', v)}
            placeholder="Calle, número, ciudad"
            required
            className={touched.address ? (isValid('address') ? 'ring-2 ring-green-400' : 'ring-2 ring-red-400') : ''}
          />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Rol</label>
              <select
                value={form.role}
                onChange={(e) => update('role', e.target.value)}
                onBlur={() => setTouched(t => ({ ...t, role: true }))}
                className={`w-full px-4 py-2 border rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200 ${touched.role && !isValid('role') ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'}`}
                required
              >
                <option value="VOLUNTARIO">Voluntario</option>
                <option value="COORDINADOR">Coordinador</option>
              </select>
              {touched.role && !isValid('role') && (
                <p className="mt-1 text-sm text-red-600">Selecciona un rol válido</p>
              )}
              <p className="text-xs text-gray-500 mt-1">El rol determina tus permisos en la plataforma.</p>
            </div>
            {error && <p className="text-red-600 text-sm text-center">{error}</p>}
            <Button
              variant="primary"
              size="md"
              loading={loading}
              type="submit"
              disabled={loading || Object.keys(validate).some(k => !isValid(k))}
              className="w-full mt-2 shadow-lg hover:shadow-xl"
            >
              {loading ? 'Procesando...' : 'Registrarme'}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
