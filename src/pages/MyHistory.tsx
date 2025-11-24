import { useEffect, useMemo, useState } from 'react'
import { myEnrollments, Activity } from '@/lib/api'
import { Button, Input } from '@/components/common'

export default function MyHistory() {
  const [items, setItems] = useState<Array<{ id: string; activityId: string; createdAt: string; activity: Activity }>>([])
  const [loading, setLoading] = useState(false)
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [types, setTypes] = useState<string[]>([])
  const [selectedTypes, setSelectedTypes] = useState<string[]>([])
  const [project, setProject] = useState('')

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        const es = await myEnrollments()
        const sorted = es.sort((a,b) => new Date(b.activity.date).getTime() - new Date(a.activity.date).getTime())
        setItems(sorted)
        const unique = Array.from(new Set(sorted.map(e => e.activity.type).filter(Boolean))) as string[]
        setTypes(unique)
      } finally { setLoading(false) }
    }
    load()
  }, [])

  const filtered = useMemo(() => {
    return items.filter(e => {
      const dt = new Date(e.activity.date).getTime()
      const okFrom = from ? dt >= new Date(from).getTime() : true
      const okTo = to ? dt <= new Date(to).getTime() : true
      const okType = selectedTypes.length ? selectedTypes.includes(e.activity.type || '') : true
      const okProj = project ? ((e.activity.project || '').toLowerCase().includes(project.toLowerCase())) : true
      return okFrom && okTo && okType && okProj
    })
  }, [items, from, to, selectedTypes, project])

  const totalHours = useMemo(() => filtered.reduce((sum, e) => sum + (e.activity.durationHours || 2), 0), [filtered])

  const exportCSV = () => {
    const headers = ['Fecha', 'Hora', 'Actividad', 'Tipo', 'Proyecto', 'Duración(h)', 'Descripción']
    const rows = filtered.map(e => {
      const d = new Date(e.activity.date)
      const fecha = `${String(d.getDate()).padStart(2,'0')}/${String(d.getMonth()+1).padStart(2,'0')}/${d.getFullYear()}`
      const hora = `${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`
      const desc = e.activity.description || ''
      return [fecha, hora, e.activity.name, e.activity.type || '', e.activity.project || '', String(e.activity.durationHours || 2), desc]
    })
    const csv = [headers.join(','), ...rows.map(r => r.map(v => `"${String(v).replace(/"/g,'""')}"`).join(','))].join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'historial_voluntariado.csv'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const printPDF = () => {
    window.print()
  }

  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Mi Historial</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportCSV}>Exportar CSV</Button>
          <Button variant="primary" onClick={printPDF}>Exportar PDF</Button>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-3">
        <Input name="from" label="Desde" type="date" value={from} onChange={v => setFrom(v)} />
        <Input name="to" label="Hasta" type="date" value={to} onChange={v => setTo(v)} />
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de actividad</label>
          <select multiple value={selectedTypes} onChange={e => setSelectedTypes(Array.from(e.target.selectedOptions).map(o => o.value))} className="w-full px-4 py-2 border rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500">
            {types.map(t => (<option key={t} value={t}>{t}</option>))}
          </select>
        </div>
        <Input name="project" label="Proyecto/beneficiario" value={project} onChange={v => setProject(v)} />
      </div>
      <div className="mt-4 p-4 bg-primary-50 rounded-xl">
        <p className="text-primary-700 font-semibold">Horas acumuladas: {totalHours}h</p>
      </div>
      {loading && <p className="mt-4">Cargando...</p>}
      <div className="mt-6 space-y-3">
        {filtered.map(e => {
          const d = new Date(e.activity.date)
          const fecha = `${String(d.getDate()).padStart(2,'0')}/${String(d.getMonth()+1).padStart(2,'0')}/${d.getFullYear()}`
          const hora = `${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`
          return (
            <div key={e.id} className="p-3 border rounded-md">
              <div className="flex justify-between">
                <p className="font-medium">{e.activity.name}</p>
                <span className="text-sm text-gray-600">{e.activity.durationHours || 2}h</span>
              </div>
              <p className="text-sm text-gray-600">{fecha} · {hora} · {e.activity.type || 'Sin tipo'}</p>
              <p className="text-xs text-gray-700 mt-1">{e.activity.description}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
