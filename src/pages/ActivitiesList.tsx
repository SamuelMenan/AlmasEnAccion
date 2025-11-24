import { useEffect, useState } from 'react';
import { listActivities, enroll, Activity, getAvailability, isEnrolled } from '@/lib/api';
import { downloadIcs } from '@/utils/calendar';
import { Button, Card, Modal } from '@/components/common';
import { useNotifications } from '@/store/notifications';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

export default function ActivitiesList() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [availability, setAvailability] = useState<Record<string, {capacity: number; enrolled: number; available: number}>>({});
  const [onlyAvailable, setOnlyAvailable] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [enrollingId, setEnrollingId] = useState<string | null>(null);
  const navigate = useNavigate();
  const auth = useAuth();
  const notify = useNotifications(s => s.add);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await listActivities();
        setActivities(data);
        const entries = await Promise.all(data.map(async a => ({ id: a.id, av: await getAvailability(a.id) })));
        const map: Record<string, {capacity: number; enrolled: number; available: number}> = {};
        entries.forEach(e => { map[e.id] = e.av; });
        setAvailability(map);
      } catch {
        setError('No se pudieron cargar actividades');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const [altFor, setAltFor] = useState<Activity | null>(null);

  const doEnroll = async (id: string, activity?: Activity) => {
    setEnrollingId(id);
    try {
      const av = await getAvailability(id);
      if (av.available <= 0) { setAltFor(activity || null); return; }
      const already = await isEnrolled(id);
      if (already) { alert('Ya estás inscrito en esta actividad'); return; }
      await enroll(id);
      const refreshed = await getAvailability(id);
      setAvailability(prev => ({ ...prev, [id]: refreshed }));
      // naive feedback
      alert('Inscripción realizada');
      if (activity) {
        downloadIcs({ title: activity.name, startISO: activity.date, durationMinutes: 120, location: activity.location, description: activity.description });
        notify({ title: 'Recordatorio creado', message: `Se descargó un evento para ${activity.name}`, href: undefined });
      }
    } catch {
      alert('Error al inscribirse');
    } finally {
      setEnrollingId(null);
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-10 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Actividades</h1>
        {(auth.hasRole('COORDINADOR') || auth.hasRole('ADMIN')) && (
          <Button variant="primary" onClick={() => navigate('/activities/new')}>Crear Actividad</Button>
        )}
      </div>
      {loading && <p>Cargando...</p>}
      {error && <p className="text-red-600 text-sm">{error}</p>}
      <div className="flex items-center justify-end gap-3">
        <label className="text-sm text-gray-700">Solo disponibles</label>
        <input type="checkbox" checked={onlyAvailable} onChange={() => setOnlyAvailable(v => !v)} />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {activities.filter(a => !onlyAvailable || (availability[a.id]?.available ?? 0) > 0).map(a => (
          <Card key={a.id} title={a.name} description={a.description}>
            <div className="mt-2 text-sm text-gray-600">{new Date(a.date).toLocaleString()} - {a.location}</div>
            <div className="mt-1 text-xs text-gray-700">Cupos: {availability[a.id]?.enrolled ?? 0}/{availability[a.id]?.capacity ?? a.capacity} · Disponibles: {availability[a.id]?.available ?? (a.capacity)}</div>
            <div className="mt-4 flex gap-2">
              <Button variant="secondary" size="sm" onClick={() => navigate(`/activities/${a.id}`)}>Detalle</Button>
              {auth.hasRole('VOLUNTARIO') && (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => doEnroll(a.id, a)}
                  disabled={!!enrollingId || (availability[a.id]?.available ?? 0) <= 0}
                >{(availability[a.id]?.available ?? 0) <= 0 ? 'Sin cupo' : (enrollingId === a.id ? 'Inscribiendo...' : 'Inscribirme')}</Button>
              )}
            </div>
          </Card>
        ))}
      </div>
      <Modal isOpen={!!altFor} onClose={() => setAltFor(null)} title="Sin cupo disponible">
        <p className="text-sm text-gray-700 mb-3">Esta actividad no tiene cupos por ahora. Opciones:</p>
        <div className="space-y-2">
          <Button variant="outline" onClick={() => { setOnlyAvailable(true); setAltFor(null); }}>Ver actividades con cupos</Button>
          {altFor && (
            <Button variant="primary" onClick={() => { downloadIcs({ title: `Recordatorio - ${altFor.name}`, startISO: altFor.date, durationMinutes: 30, location: altFor.location, description: 'Recordatorio para revisar disponibilidad' }); notify({ title: 'Recordatorio creado', message: `Se descargó un recordatorio para ${altFor.name}` }); setAltFor(null); }}>Crear recordatorio</Button>
          )}
        </div>
      </Modal>
    </div>
  );
}
