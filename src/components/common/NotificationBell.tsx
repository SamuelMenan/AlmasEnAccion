import { useEffect, useState } from 'react'
import { useNotifications } from '@/store/notifications'
import { Button } from './Button'

export const NotificationBell: React.FC = () => {
  const { items, unread, fetch, connect, markRead } = useNotifications()
  const [open, setOpen] = useState(false)
  useEffect(() => {
    const token = localStorage.getItem('aea_token')
    if (!token) return
    ;(async () => { try { await fetch() } catch {} })()
    connect()
  }, [fetch, connect])

  return (
    <div className="relative">
      <button className="relative h-10 px-3 inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors text-gray-700 hover:text-primary-600 hover:bg-primary-50 hover:ring-1 hover:ring-primary-200" onClick={() => setOpen(o => !o)} aria-label="Notificaciones">
        <span className="material-icons" style={{ fontSize: 20 }}>notifications</span>
        {unread > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full px-1">{unread}</span>
        )}
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-2 max-w-[95vw] w-[420px] md:w-[520px] bg-white border rounded-lg shadow-sm z-50 transition-all duration-200">
          <div className="flex items-center justify-between px-3 py-2 border-b">
            <p className="text-base font-semibold">Notificaciones</p>
            <div className="flex gap-2">
              <Button variant="outline" size="xs" onClick={() => useNotifications.getState().markAllRead()}>Marcar todas</Button>
              <Button variant="outline" size="xs" onClick={() => setOpen(false)}>Cerrar</Button>
            </div>
          </div>
          <div className="max-h-[60vh] overflow-y-auto shadow-inner p-3">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center text-gray-600 space-y-2">
                <span className="material-icons" style={{ fontSize: 20 }}>notifications_off</span>
                <p className="text-sm">No hay notificaciones</p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {items.slice(0, 10).map(n => (
                  <button key={n.id} className={`w-full text-left rounded-lg shadow-sm ring-1 ring-gray-200 p-3 transition-opacity duration-200 ${n.read ? 'opacity-70' : 'opacity-100'} bg-white`} onClick={() => markRead(n.id)}>
                    <div className="flex items-start gap-2">
                      <span className="material-icons text-gray-700" style={{ fontSize: 20 }}>{iconFor(n.title)}</span>
                      <div className="flex-1 space-y-2">
                        <p className="text-base font-semibold text-gray-900">{n.title}</p>
                        <p className="text-sm text-gray-700">{n.message}</p>
                        <p className="text-xs text-gray-500">{formatTs(n.createdAt)}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

function iconFor(title: string) {
  const t = (title || '').toLowerCase()
  if (t.includes('inscripción') || t.includes('inscrito')) return 'check_circle'
  if (t.includes('desinscr')) return 'cancel'
  if (t.includes('nueva actividad') || t.includes('actividad')) return 'event'
  return 'notifications'
}

function formatTs(ts?: string) {
  if (!ts) return ''
  const d = new Date(ts)
  return `${String(d.getDate()).padStart(2,'0')}/${String(d.getMonth()+1).padStart(2,'0')}/${d.getFullYear()} ${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`
}
