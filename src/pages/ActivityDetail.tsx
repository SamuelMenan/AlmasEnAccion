import { useEffect, useState } from 'react';
import { listActivities, enroll, Activity, listVolunteers, assignVolunteer, getAvailability, assignVolunteerByEmail, listEnrollmentsByActivity, markAttendance, isEnrolled, unenroll, adminUnenroll } from '@/lib/api';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Input } from '@/components/common';
import { useAuth } from '@/context/AuthContext';
import { downloadIcs } from '@/utils/calendar';
import { useNotifications } from '@/store/notifications';

export default function ActivityDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const auth = useAuth();
  const [activity, setActivity] = useState<Activity | null>(null);
  const [loading, setLoading] = useState(false);
  const [enrolling, setEnrolling] = useState(false);
  const [volunteers, setVolunteers] = useState<Array<{ id: string; name: string; email: string; address?: string }>>([]);
  const [q, setQ] = useState('');
  const [selectedVolunteer, setSelectedVolunteer] = useState<{ id: string; name: string; email: string } | null>(null);
  const [emailAssign, setEmailAssign] = useState('');
  const [searchError, setSearchError] = useState<string | null>(null);
  const [availability, setAvailability] = useState<{ capacity: number; enrolled: number; available: number } | null>(null);
  const [suggestions, setSuggestions] = useState<Array<{ id: string; name: string; email: string }>>([]);
  const notify = useNotifications(s => s.add);
  const [enrollments, setEnrollments] = useState<Array<{ enrollmentId: string; userId: string; name: string; email: string; attended: boolean; attendedAt?: string }>>([]);
  const [alreadyEnrolled, setAlreadyEnrolled] = useState(false);

  useEffect(() => {
    const load = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const all = await listActivities();
        setActivity(all.find(a => a.id === id) || null);
        const av = await getAvailability(id);
        setAvailability(av);
        const ie = await isEnrolled(id);
        setAlreadyEnrolled(ie);
        if (auth.hasRole('COORDINADOR') || auth.hasRole('ADMIN')) {
          const vs = await listVolunteers();
          vs.sort((a,b) => a.name.localeCompare(b.name));
          setVolunteers(vs);
          const es = await listEnrollmentsByActivity(id);
          setEnrollments(es);
        }
      } finally { setLoading(false); }
    };
    load();
  }, [id]);

  useEffect(() => {
    const ctrl = new AbortController();
    const t = setTimeout(async () => {
      try {
        const res = await listVolunteers({ q });
        res.sort((a,b) => a.name.localeCompare(b.name));
        setSuggestions(res.slice(0, 6));
        const tokens = q.trim().split(/\s+/).filter(Boolean);
        if (tokens.length < 2) {
          setSearchError('Ingrese nombre y apellido del usuario');
        } else if (res.length === 0) {
          setSearchError('No se encontraron coincidencias');
        } else {
          setSearchError(null);
        }
        setSelectedVolunteer(null);
      } catch { setSuggestions([]); }
    }, 250);
    return () => { clearTimeout(t); ctrl.abort(); };
  }, [q]);

  const doEnroll = async () => {
    if (!id) return;
    setEnrolling(true);
    try {
      const av = await getAvailability(id);
      if (av.available <= 0) { alert('No quedan cupos'); return; }
      const already = await isEnrolled(id);
      if (already) { alert('Ya estás inscrito'); return; }
      await enroll(id);
      alert('Inscripción realizada');
      setAlreadyEnrolled(true);
    } catch {
      alert('Error al inscribirse');
    } finally { setEnrolling(false); }
  };

  const doUnenroll = async () => {
    if (!id) return;
    const ok = window.confirm('¿Deseas desinscribirte?');
    if (!ok) return;
    const reason = window.prompt('Opcional: razón de desinscripción');
    try {
      await unenroll(id, reason || undefined);
      alert('Desinscripción realizada');
      setAlreadyEnrolled(false);
      const av = await getAvailability(id);
      setAvailability(av);
    } catch { alert('Error al desinscribirse'); }
  }

  if (loading) return <p className="p-10">Cargando...</p>;
  if (!activity) return <p className="p-10">Actividad no encontrada</p>;

  return (
    <div className="max-w-xl mx-auto py-10 space-y-4">
      <Button variant="outline" size="sm" onClick={() => navigate(-1)}>Volver</Button>
      <h1 className="text-2xl font-bold">{activity.name}</h1>
      <p className="text-gray-700">{activity.description}</p>
      <p className="text-sm text-gray-600">{new Date(activity.date).toLocaleString()} - {activity.location}</p>
      <p className="text-sm text-gray-600">{[activity.city, activity.department].filter(Boolean).join(' - ')}</p>
      {availability && (
        <p className="text-xs text-gray-700">Cupos: {availability.enrolled}/{availability.capacity} · Disponibles: {availability.available}</p>
      )}
      {(auth.hasRole('COORDINADOR') || auth.hasRole('ADMIN')) && enrollments.length > 0 && (
        <div className="mt-8">
          <h2 className="text-lg font-semibold mb-2">Control de asistencia</h2>
          <div className="space-y-2">
            {enrollments.map(e => (
              <div key={e.enrollmentId} className="flex justify-between items-center p-2 border rounded-md">
                <div>
                  <p className="font-medium text-sm">{e.name}</p>
                  <p className="text-xs text-gray-600">{e.email} · {e.attended ? `Confirmada ${new Date(e.attendedAt || '').toLocaleString()}` : 'Pendiente'}</p>
                </div>
                <Button
                  variant={e.attended ? 'secondary' : 'primary'}
                  size="sm"
                  className="hover:shadow-md active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={async () => {
                    if (!id) return;
                    if (e.attended) { alert('Asistencia ya registrada'); return; }
                    const ok = window.confirm(`Marcar presencia de ${e.name}?`);
                    if (!ok) return;
                    try {
                      const res = await markAttendance(e.enrollmentId);
                      notify({ title: 'Asistencia confirmada', message: `${e.name} - ${new Date(res.attendedAt).toLocaleString()}` });
                      setEnrollments(prev => prev.map(x => x.enrollmentId === e.enrollmentId ? { ...x, attended: true, attendedAt: res.attendedAt } : x));
                    } catch { alert('Error registrando asistencia'); }
                  }}
                  disabled={availability?.available === 0}
                >{e.attended ? 'Presente' : 'Marcar Presencia'}</Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="hover:shadow-md active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed ml-2"
                  onClick={async () => {
                    if (!id) return;
                    const ok = window.confirm(`Desinscribir a ${e.name}?`);
                    if (!ok) return;
                    const reason = window.prompt('Razón (opcional)');
                    try {
                      await adminUnenroll(id, e.userId, reason || undefined);
                      notify({ title: 'Usuario desinscrito', message: `${e.name}` });
                      setEnrollments(prev => prev.filter(x => x.enrollmentId !== e.enrollmentId));
                      const av = await getAvailability(id);
                      setAvailability(av);
                    } catch { alert('Error desinscribiendo'); }
                  }}
                >Desinscribir</Button>
              </div>
            ))}
          </div>
        </div>
      )}
      {auth.hasRole('VOLUNTARIO') && (
        alreadyEnrolled ? (
          <Button variant="outline" size="md" onClick={doUnenroll}>Desinscribirse</Button>
        ) : (
          <Button variant="primary" size="md" onClick={doEnroll} disabled={enrolling}>{enrolling ? 'Inscribiendo...' : 'Inscribirme'}</Button>
        )
      )}
      {(auth.hasRole('COORDINADOR') || auth.hasRole('ADMIN')) && (
        <div className="mt-6 border-t pt-4">
          <h2 className="text-lg font-semibold">Asignación manual</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
            <Input name="q" label="Buscar" placeholder="Ingrese nombre y apellido del usuario" value={q} onChange={v => setQ(v)} />
            <Input name="email" label="Asignar por correo" type="email" placeholder="usuario@correo.com" value={emailAssign} onChange={v => setEmailAssign(v)} />
          </div>
          {searchError && (
            <p className="text-sm text-red-600 mt-1">{searchError}</p>
          )}
          {!!suggestions.length && (
            <div className="mt-2 bg-white border rounded-md shadow-sm">
              {suggestions.map(s => (
                <button type="button" key={s.id} className="block w-full text-left px-3 py-2 hover:bg-gray-50" onClick={() => { setQ(s.name); setSelectedVolunteer({ id: s.id, name: s.name, email: s.email }); setEmailAssign(s.email); setSearchError(null); }}>{s.name} · {s.email}</button>
              ))}
            </div>
          )}
          <div className="mt-3 space-y-2">
            {volunteers
              .filter(v => {
                const term = q.trim().toLowerCase();
                if (!term) return true;
                const tokens = term.split(/\s+/).filter(Boolean);
                const name = v.name.toLowerCase();
                const email = v.email.toLowerCase();
                if (tokens.length >= 2) {
                  return tokens.every(t => name.includes(t)) || email.includes(term);
                }
                return name.includes(term) || email.includes(term);
              })
              .sort((a,b) => a.name.localeCompare(b.name))
              .map(v => (
              <div key={v.id} className="flex justify-between items-center p-2 border rounded-md">
                <div>
                  <p className="font-medium text-sm">{v.name}</p>
                  <p className="text-xs text-gray-600">{v.email}</p>
                </div>
                <Button variant="primary" size="sm" className="hover:shadow-md active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed" aria-label={`Asignar a ${v.name}`} onClick={async () => {
                  if (!id) return;
                  try {
                    await assignVolunteer(id, v.id);
                    notify({ title: 'Voluntario asignado', message: `${v.name} fue asignado`, href: undefined });
                    downloadIcs({ title: activity.name, startISO: activity.date, durationMinutes: 120, location: activity.location, description: activity.description });
                    const av = await getAvailability(id);
                    setAvailability(av);
                  } catch { alert('Error asignando'); }
                }} disabled={availability?.available === 0}>Asignar</Button>
              </div>
            ))}
          </div>
          <div className="mt-4 flex justify-end">
            {(() => {
              const tokens = q.trim().split(/\s+/).filter(Boolean);
              const canUser = !!selectedVolunteer && tokens.length >= 2;
              const okEmail = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(emailAssign);
              const disabled = (availability?.available === 0) || !(canUser || okEmail);
              const label = canUser ? 'Asignar por usuario' : 'Asignar por correo';
              return (
                <Button
                  variant="primary"
                  size="sm"
                  className="hover:shadow-md active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={disabled}
                  onClick={async () => {
                    if (!id) return;
                    if (canUser && selectedVolunteer) {
                      try {
                        await assignVolunteer(id, selectedVolunteer.id);
                        notify({ title: 'Voluntario asignado', message: `${selectedVolunteer.name} fue asignado`, href: undefined });
                        const av = await getAvailability(id);
                        setAvailability(av);
                        setSelectedVolunteer(null);
                      } catch { alert('Error asignando por usuario'); }
                    } else if (okEmail) {
                      try {
                        await assignVolunteerByEmail(id, emailAssign);
                        notify({ title: 'Voluntario asignado', message: `Se asignó ${emailAssign}`, href: undefined });
                        const av = await getAvailability(id);
                        setAvailability(av);
                      } catch { alert('Error asignando por correo'); }
                    } else {
                      setSearchError('Complete nombre y apellido o un correo válido');
                    }
                  }}
                >{label}</Button>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
}
