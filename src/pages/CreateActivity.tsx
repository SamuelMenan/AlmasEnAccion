import { useEffect, useMemo, useState } from 'react';
import { Input, Button } from '@/components/common';
import { createActivity } from '@/lib/api';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '@/store/notifications';
import { useAuth } from '@/context/AuthContext';

export default function CreateActivity() {
  const navigate = useNavigate();
  const notify = useNotifications(s => s.add);
  const auth = useAuth();
  const [form, setForm] = useState({ name: '', description: '', date: '', location: '', city: '', department: '', capacity: '' });
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string | undefined;
  const formatLocal = (d: Date) => {
    const pad = (n: number) => String(n).padStart(2, '0');
    const y = d.getFullYear();
    const m = pad(d.getMonth() + 1);
    const day = pad(d.getDate());
    const h = pad(d.getHours());
    const min = pad(d.getMinutes());
    return `${y}-${m}-${day}T${h}:${min}`;
  };
  const minDate = formatLocal(new Date(Date.now() + 24 * 60 * 60 * 1000));

  const update = (k: string, v: string) => {
    setForm(f => ({ ...f, [k]: v }));
    if (touched[k]) validateField(k, v);
  };

  const validateField = (k: string, v: string) => {
    let msg = '';
    if (k === 'name') {
      if (!v || v.trim().length < 5 || v.trim().length > 100) msg = 'Nombre entre 5 y 100 caracteres';
    }
    if (k === 'description') {
      if (!v || v.trim().length < 20 || v.trim().length > 1000) msg = 'Descripción entre 20 y 1000 caracteres';
    }
    if (k === 'date') {
      const d = v ? new Date(v) : null;
      const now = new Date();
      if (!d || Number.isNaN(d.getTime())) msg = 'Fecha/hora inválida';
      else if (d.getTime() - now.getTime() < 24 * 60 * 60 * 1000) msg = 'Debe ser al menos en 24h';
    }
    if (k === 'location') {
      if (!v || v.trim().length < 3) msg = 'Dirección requerida';
    }
    if (k === 'city') {
      if (!v || v.trim().length < 2) msg = 'Ciudad requerida';
    }
    if (k === 'department') {
      if (!v || v.trim().length < 2) msg = 'Departamento requerido';
    }
    if (k === 'capacity') {
      const n = Number(v);
      if (!Number.isInteger(n) || n < 1 || n > 500) msg = 'Cupos 1-500, solo enteros';
    }
    setErrors(e => ({ ...e, [k]: msg }));
    return !msg;
  };

  const validateAll = () => {
    const ok = [
      validateField('name', form.name),
      validateField('description', form.description),
      validateField('date', form.date),
      validateField('location', form.location),
      validateField('city', form.city),
      validateField('department', form.department),
      validateField('capacity', form.capacity),
    ].every(Boolean);
    return ok;
  };

  useEffect(() => {
    if (!apiKey || !form.location || form.location.length < 3) { setSuggestions([]); return; }
    const ctrl = new AbortController();
    const run = async () => {
      try {
        const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(form.location)}&key=${apiKey}`;
        const res = await fetch(url, { signal: ctrl.signal });
        const data = await res.json();
        const items = Array.isArray(data.predictions) ? data.predictions.map((p: any) => p.description).slice(0, 5) : [];
        setSuggestions(items);
      } catch { setSuggestions([]); }
    };
    const t = setTimeout(run, 300);
    return () => { clearTimeout(t); ctrl.abort(); };
  }, [apiKey, form.location]);

  const canProceed = useMemo(() => validateAll(), [form]);

  const submit = async () => {
    setLoading(true);
    try {
      const payload = { name: form.name.trim(), description: form.description.trim(), scheduledAt: new Date(form.date).toISOString(), location: form.location.trim(), city: form.city.trim(), department: form.department.trim(), capacity: Number(form.capacity) };
      const created = await createActivity(payload);
      setStep(3);
      if (auth.activeRole === 'COORDINADOR' || auth.roles.includes('COORDINADOR')) {
        notify({ title: 'Actividad creada', message: `${payload.name} en ${payload.location}`, href: '/activities' });
      }
    } catch (e) {
      setErrors(e => ({ ...e, submit: 'Error creando actividad' }));
    } finally { setLoading(false); }
  };

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-6">Creación de actividad</h1>

      {step === 1 && (
        <form onSubmit={(e) => { e.preventDefault(); if (validateAll()) setStep(2); }} className="space-y-5">
          <div>
            <Input name="name" label="Nombre de actividad" required value={form.name} onChange={v => update('name', v)} onBlur={() => setTouched(t => ({ ...t, name: true }))} error={errors.name} />
          </div>
          <div>
            <Input name="description" label="Descripción detallada" type="textarea" required value={form.description} onChange={v => update('description', v)} onBlur={() => setTouched(t => ({ ...t, description: true }))} error={errors.description} />
            <p className="text-xs text-gray-500 mt-1">{form.description.length}/1000</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input name="date" label="Fecha y hora" type="datetime-local" required value={form.date} onChange={v => update('date', v)} onBlur={() => setTouched(t => ({ ...t, date: true }))} error={errors.date} min={minDate} step="60" />
            <div>
              <Input name="location" label="Dirección" required value={form.location} onChange={v => update('location', v)} onBlur={() => setTouched(t => ({ ...t, location: true }))} error={errors.location} />
              {!!suggestions.length && (
                <div className="bg-white border rounded-md shadow-sm">
                  {suggestions.map(s => (
                    <button type="button" key={s} className="block w-full text-left px-3 py-2 hover:bg-gray-50" onClick={() => setForm(f => ({ ...f, location: s }))}>{s}</button>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input name="city" label="Ciudad" required value={form.city} onChange={v => update('city', v)} onBlur={() => setTouched(t => ({ ...t, city: true }))} error={errors.city} />
            <Input name="department" label="Departamento" required value={form.department} onChange={v => update('department', v)} onBlur={() => setTouched(t => ({ ...t, department: true }))} error={errors.department} />
          </div>
          <Input name="capacity" label="Cupos" type="number" required value={form.capacity} onChange={v => update('capacity', v)} onBlur={() => setTouched(t => ({ ...t, capacity: true }))} error={errors.capacity} min="1" max="500" step="1" />
          {errors.submit && <p className="text-red-600 text-sm">{errors.submit}</p>}
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => navigate(-1)}>Cancelar</Button>
            <Button variant="primary" type="submit" disabled={!canProceed}>Continuar</Button>
          </div>
        </form>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl border p-4">
            <h2 className="text-lg font-semibold">Resumen</h2>
            <ul className="mt-2 text-sm text-gray-700 space-y-1">
              <li><span className="font-medium">Nombre:</span> {form.name}</li>
              <li><span className="font-medium">Descripción:</span> {form.description}</li>
              <li><span className="font-medium">Fecha:</span> {form.date}</li>
              <li><span className="font-medium">Dirección:</span> {form.location}</li>
              <li><span className="font-medium">Ciudad:</span> {form.city}</li>
              <li><span className="font-medium">Departamento:</span> {form.department}</li>
              <li><span className="font-medium">Cupos:</span> {form.capacity}</li>
            </ul>
          </div>
          <div className="flex justify-between">
            <Button variant="secondary" onClick={() => setStep(1)}>Editar</Button>
            <Button variant="primary" onClick={submit} loading={loading}>Confirmar y crear</Button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="text-center space-y-4">
          <div className="mx-auto w-24 h-24 rounded-full bg-emerald-100 flex items-center justify-center animate-bounce">
            <span className="material-icons text-emerald-600" style={{ fontSize: 48 }}>check_circle</span>
          </div>
          <p className="text-lg font-semibold">Actividad creada</p>
          <div className="flex justify-center gap-3">
            <Button variant="primary" onClick={() => navigate('/activities')}>Ver actividades</Button>
            <Button variant="outline" onClick={() => { setForm({ name: '', description: '', date: '', location: '', capacity: '' }); setStep(1); }}>Crear otra</Button>
            <Button variant="secondary" onClick={() => navigate('/')}>Volver al inicio</Button>
          </div>
        </div>
      )}
    </div>
  );
}
