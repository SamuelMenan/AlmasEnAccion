import { useEffect, useState, useRef } from 'react';
import api, { getMe, updateMe, UpdateProfileRequest, UserProfile, myEnrollments } from '@/lib/api';
import { Input, Button } from '@/components/common';
import { useNotifications } from '@/store/notifications';
import { updateRole } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

export default function Profile() {
  const auth = useAuth();
  const notify = useNotifications(s => s.add);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [form, setForm] = useState<UpdateProfileRequest>({});
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [avatar, setAvatar] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarBlobUrl, setAvatarBlobUrl] = useState<string | null>(null);
  const MAX_AVATAR_BYTES = 512 * 1024;
  const [touched, setTouched] = useState<{ [k: string]: boolean }>({});
  const [saving, setSaving] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [enrollments, setEnrollments] = useState<Array<{ id: string; activityId: string; createdAt: string; activity: { name: string; date: string; location: string } }>>([]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const me = await getMe();
        setProfile(me);
        setForm({ firstName: me.firstName, lastName: me.lastName, phone: me.phone });
        // Usamos avatarBlobUrl para imágenes persistidas; 'avatar' solo para preview local.
        setAvatar(null);
        if (me.avatarUrl) {
          try {
            const res = await api.get(`/profile/avatar/${me.avatarUrl}`, { responseType: 'blob' });
            const blob = res.data as Blob;
            if (blob && blob.size && blob.size > MAX_AVATAR_BYTES) setAvatarBlobUrl(null);
            else {
              const url = URL.createObjectURL(blob);
              setAvatarBlobUrl(url);
            }
          } catch {
            setAvatarBlobUrl(null);
          }
        } else {
          setAvatarBlobUrl(null);
        }
      } finally { setLoading(false); }
    };
    load();
    (async () => {
      try { const items = await myEnrollments(); setEnrollments(items); } catch {}
    })();
    
  }, []);

  const updateField = (k: keyof UpdateProfileRequest, v: string) => {
    setForm(f => ({ ...f, [k]: v }));
    setTouched(t => ({ ...t, [k]: true }));
  };

  // Validaciones simples
  const validate = {
    firstName: (v: string) => v && v.length > 1,
    lastName: (v: string) => v && v.length > 1,
    phone: (v: string) => v && v.length >= 8,
  };
  const isValid = (key: keyof typeof validate) => validate[key](form[key] || '');

  const onAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onload = ev => setAvatar(ev.target?.result as string);
      reader.readAsDataURL(file);
      if (avatarBlobUrl) {
        URL.revokeObjectURL(avatarBlobUrl);
        setAvatarBlobUrl(null);
      }
    }
  };

  const onSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(false);
    setSaving(true);
    try {
      // Ahora se envía el avatarFile si existe
      const updated = await updateMe(form, avatarFile || undefined);
      setProfile(updated);
      setSaved(true);
      // Actualizar visual del avatar persistido
      if (updated.avatarUrl) {
        try {
          const res = await api.get(`/profile/avatar/${updated.avatarUrl}`, { responseType: 'blob' });
          const url = URL.createObjectURL(res.data as Blob);
          setAvatarBlobUrl(url);
          setAvatar(null);
        } catch {
          setAvatarBlobUrl(null);
        }
      } else {
        setAvatarBlobUrl(null);
      }
      // Persistir cambio de rol seleccionado
      const desired = (auth.activeRole || auth.roles[0] || 'VOLUNTARIO') as 'VOLUNTARIO' | 'COORDINADOR';
      try {
        const res = await updateRole(desired);
        notify({ title: 'Rol actualizado', message: `Nuevo rol: ${res.role}`, href: '/profile' });
        await auth.refresh();
      } catch {/* mantener perfil aunque fallo rol */}
    } catch {
      alert('Error al actualizar perfil');
    } finally {
      setSaving(false);
    }
  };

  if (loading && !profile) return <p className="p-10">Cargando perfil...</p>;
  if (!profile) return <p className="p-10">Perfil no disponible</p>;

  const displayName = `${profile.firstName ?? ''}${profile.lastName ? ' ' + profile.lastName : ''}`.trim() || profile.email;
  const initials = (displayName || '').split(' ').filter(Boolean).slice(0, 2).map(s => s[0]?.toUpperCase()).join('') || (profile.email?.[0]?.toUpperCase() ?? 'U');

  return (
    <div className="flex flex-col items-center min-h-[100vh] bg-gray-50">
      <div className="h-20" />
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 mx-auto">
        <div className="flex flex-col items-center mb-4">
          <div className="relative group mb-2">
            {avatarBlobUrl ? (
              <img
                src={avatarBlobUrl}
                alt="Avatar"
                className="w-24 h-24 rounded-full object-cover border-4 border-primary-100 shadow-md bg-gray-100"
              />
            ) : avatar && avatar.startsWith('data:') ? (
              <img
                src={avatar}
                alt="Avatar"
                className="w-24 h-24 rounded-full object-cover border-4 border-primary-100 shadow-md bg-gray-100"
              />
            ) : (
              <span className="w-24 h-24 rounded-full flex items-center justify-center text-3xl font-semibold text-white bg-primary-600 border-4 border-primary-100 shadow-md">
                {initials}
              </span>
            )}
            <button
              type="button"
              className="absolute bottom-0 right-0 bg-primary-600 text-white rounded-full p-1 shadow hover:bg-primary-700 transition"
              onClick={() => fileInputRef.current?.click()}
              aria-label="Cambiar foto de perfil"
            >
              <span className="material-icons" style={{ fontSize: 20 }}>photo_camera</span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={onAvatarChange}
            />
          </div>
          <h1 className="text-3xl font-bold text-center">Mi Perfil</h1>
          <p className="text-gray-500 text-center text-sm">Actualiza tu información personal</p>
        </div>
        <form onSubmit={onSave} className="space-y-5 mt-2">
          <Input
            name="firstName"
            label="Nombre"
            value={form.firstName || ''}
            onChange={v => updateField('firstName', v)}
            placeholder="Tu nombre"
            required
            className={touched.firstName ? (isValid('firstName') ? 'ring-2 ring-green-400' : 'ring-2 ring-red-400') : ''}
          />
          <Input
            name="lastName"
            label="Apellido"
            value={form.lastName || ''}
            onChange={v => updateField('lastName', v)}
            placeholder="Tu apellido"
            required
            className={touched.lastName ? (isValid('lastName') ? 'ring-2 ring-green-400' : 'ring-2 ring-red-400') : ''}
          />
          <Input
            name="phone"
            label="Teléfono"
            value={form.phone || ''}
            onChange={v => updateField('phone', v)}
            placeholder="Tu teléfono"
            required
            className={touched.phone ? (isValid('phone') ? 'ring-2 ring-green-400' : 'ring-2 ring-red-400') : ''}
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Rol</label>
            <div className="mt-1">
              <select
                value={auth.activeRole || auth.roles[0] || 'VOLUNTARIO'}
                onChange={(e) => auth.setActiveRole(e.target.value)}
                className="w-full px-4 py-2 rounded-xl bg-white border border-gray-300 text-gray-700 text-base"
                aria-label="Seleccionar rol activo"
              >
                <option value="VOLUNTARIO">Voluntario</option>
                <option value="COORDINADOR">Coordinador</option>
              </select>
              {auth.activeRole && !auth.roles.includes(auth.activeRole) && (
                <p className="text-xs text-amber-600 mt-1">Seleccionado pero no asignado aún. Se guardará al confirmar.</p>
              )}
            </div>
          </div>
          <Button
            variant="primary"
            type="submit"
            className="w-full mt-2 shadow-lg hover:shadow-xl transition-all duration-200"
            loading={saving}
            disabled={saving || !isValid('firstName') || !isValid('lastName') || !isValid('phone')}
          >
            {saving ? 'Guardando…' : 'Guardar'}
          </Button>
          {saved && <p className="text-green-600 text-sm text-center">Cambios guardados</p>}
        </form>
        <div className="mt-8">
          <h2 className="text-lg font-semibold mb-2">Historial de participaciones</h2>
          {enrollments.length === 0 ? (
            <p className="text-sm text-gray-600">Aún no te has inscrito en actividades.</p>
          ) : (
            <ul className="space-y-2">
              {enrollments.map(e => (
                <li key={e.id} className="flex justify-between items-center p-3 border rounded-md">
                  <div>
                    <p className="font-medium">{e.activity.name}</p>
                    <p className="text-xs text-gray-600">{new Date(e.activity.date).toLocaleString()} · {e.activity.location}</p>
                  </div>
                  <span className="text-xs text-gray-500">{new Date(e.createdAt).toLocaleDateString()}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
