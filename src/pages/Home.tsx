import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { HeartHandshake, CalendarDays, ShieldCheck, Users } from 'lucide-react'

export default function Home() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => { const t = setTimeout(() => setMounted(true), 50); return () => clearTimeout(t) }, [])

  const scrollTo = (id: string) => {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <main className="w-full">
      <section id="presentacion" className="relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className={`grid grid-cols-1 md:grid-cols-2 items-center gap-8 md:gap-12 py-10 md:py-16 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'} transition-all duration-500`}>
            <div>
              <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-primary-700">AlmasEnAcción</h1>
              <p className="mt-4 text-gray-700 text-base md:text-lg">Conectamos voluntarios con causas reales para generar impacto positivo en comunidades. Únete, participa y transforma vidas con acciones coordinadas y transparentes.</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <button onClick={() => scrollTo('caracteristicas')} className="h-10 px-4 inline-flex items-center rounded-md text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 transition-colors">Conocer más</button>
                <Link to="/activities" className="h-10 px-4 inline-flex items-center rounded-md text-sm font-medium text-primary-600 ring-1 ring-primary-200 hover:bg-primary-50 transition-colors">Ver actividades</Link>
              </div>
              <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="rounded-lg bg-primary-50 ring-1 ring-primary-200 p-4 text-center">
                  <p className="text-2xl font-bold text-primary-700">200+</p>
                  <p className="text-xs text-gray-600">Voluntarios activos</p>
                </div>
                <div className="rounded-lg bg-primary-50 ring-1 ring-primary-200 p-4 text-center">
                  <p className="text-2xl font-bold text-primary-700">50+</p>
                  <p className="text-xs text-gray-600">Actividades al año</p>
                </div>
                <div className="rounded-lg bg-primary-50 ring-1 ring-primary-200 p-4 text-center">
                  <p className="text-2xl font-bold text-primary-700">20+</p>
                  <p className="text-xs text-gray-600">Aliados comunitarios</p>
                </div>
                <div className="rounded-lg bg-primary-50 ring-1 ring-primary-200 p-4 text-center">
                  <p className="text-2xl font-bold text-primary-700">100%</p>
                  <p className="text-xs text-gray-600">Transparencia</p>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-[4/3] w-full rounded-2xl bg-gradient-to-br from-primary-100 via-primary-50 to-white ring-1 ring-primary-200 shadow-sm p-4">
                <div className="grid grid-cols-3 gap-3 h-full">
                  <div className="flex items-center justify-center rounded-xl bg-white ring-1 ring-primary-200 transition-transform duration-200 hover:scale-105">
                    <HeartHandshake className="w-8 h-8 text-primary-700" />
                  </div>
                  <div className="flex items-center justify-center rounded-xl bg-primary-50 ring-1 ring-primary-200 transition-transform duration-200 hover:scale-105">
                    <Users className="w-8 h-8 text-primary-700" />
                  </div>
                  <div className="flex items-center justify-center rounded-xl bg-white ring-1 ring-primary-200 transition-transform duration-200 hover:scale-105">
                    <CalendarDays className="w-8 h-8 text-primary-700" />
                  </div>
                  <div className="flex items-center justify-center rounded-xl bg-primary-50 ring-1 ring-primary-200 transition-transform duration-200 hover:scale-105">
                    <ShieldCheck className="w-8 h-8 text-primary-700" />
                  </div>
                  <div className="flex items-center justify-center rounded-xl bg-white ring-1 ring-primary-200 transition-transform duration-200 hover:scale-105">
                    <Users className="w-8 h-8 text-primary-700" />
                  </div>
                  <div className="flex items-center justify-center rounded-xl bg-primary-50 ring-1 ring-primary-200 transition-transform duration-200 hover:scale-105">
                    <HeartHandshake className="w-8 h-8 text-primary-700" />
                  </div>
                  <div className="col-span-3 mt-auto rounded-xl bg-white ring-1 ring-primary-200 p-4 flex items-center justify-between">
                    <p className="text-sm md:text-base text-gray-700">Acciones coordinadas, comunidad y transparencia</p>
                    <div className="hidden md:flex -space-x-2">
                      <span className="w-8 h-8 rounded-full bg-primary-100 ring-1 ring-primary-200" />
                      <span className="w-8 h-8 rounded-full bg-primary-200 ring-1 ring-primary-200" />
                      <span className="w-8 h-8 rounded-full bg-primary-300 ring-1 ring-primary-200" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white/80 to-transparent pointer-events-none" />
      </section>

      <nav className="sticky top-16 z-30 bg-white/80 backdrop-blur border-y">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="h-12 flex items-center gap-4">
            <button onClick={() => scrollTo('presentacion')} className="h-9 px-3 rounded-md text-sm font-medium text-gray-700 hover:text-primary-600 hover:bg-primary-50 hover:ring-1 hover:ring-primary-200">Presentación</button>
            <button onClick={() => scrollTo('caracteristicas')} className="h-9 px-3 rounded-md text-sm font-medium text-gray-700 hover:text-primary-600 hover:bg-primary-50 hover:ring-1 hover:ring-primary-200">Características</button>
            <button onClick={() => scrollTo('accion')} className="h-9 px-3 rounded-md text-sm font-medium text-gray-700 hover:text-primary-600 hover:bg-primary-50 hover:ring-1 hover:ring-primary-200">Acción</button>
          </div>
        </div>
      </nav>

      <section id="caracteristicas" className="py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-primary-700">Características principales</h2>
          <p className="mt-2 text-gray-700">Herramientas que facilitan tu participación y garantizan transparencia.</p>
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <FeatureCard icon={<HeartHandshake className="w-6 h-6" />} title="Impacto real" text="Actividades diseñadas junto a organizaciones locales para maximizar resultados." />
            <FeatureCard icon={<CalendarDays className="w-6 h-6" />} title="Gestión ágil" text="Calendario claro y recordatorios para mantenerte al día." />
            <FeatureCard icon={<ShieldCheck className="w-6 h-6" />} title="Transparencia" text="Seguimiento de acciones y reportes públicos de resultados." />
            <FeatureCard icon={<Users className="w-6 h-6" />} title="Comunidad" text="Conecta con voluntarios y coordina tus esfuerzos fácilmente." />
          </div>
        </div>
      </section>

      <section id="accion" className="py-12 md:py-16 bg-primary-50 border-t">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl bg-white ring-1 ring-primary-200 p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex-1">
              <h3 className="text-xl md:text-2xl font-bold text-primary-700">Únete y participa</h3>
              <p className="mt-2 text-gray-700">Explora actividades y aporta tu tiempo donde más se necesita.</p>
            </div>
            <div className="flex gap-3">
              <Link to="/activities" className="h-10 px-4 inline-flex items-center rounded-md text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 transition-colors">Ver actividades</Link>
              <button onClick={() => scrollTo('caracteristicas')} className="h-10 px-4 inline-flex items-center rounded-md text-sm font-medium text-primary-600 ring-1 ring-primary-200 hover:bg-primary-50 transition-colors">Cómo funciona</button>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

type FeatureProps = { icon: React.ReactNode; title: string; text: string }
function FeatureCard({ icon, title, text }: FeatureProps) {
  const [hover, setHover] = useState(false)
  return (
    <div onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} className={`group rounded-xl bg-white ring-1 ring-primary-200 p-5 shadow-sm transition-all duration-200 ${hover ? 'shadow-md scale-[1.02] ring-primary-300' : 'scale-100'}`}>
      <div className="flex items-center gap-3">
        <div className={`flex items-center justify-center w-10 h-10 rounded-md ring-1 ${hover ? 'bg-primary-50 ring-primary-300 text-primary-700' : 'bg-primary-50 ring-primary-200 text-primary-700'}`}>{icon}</div>
        <h3 className="text-base font-semibold text-gray-900">{title}</h3>
      </div>
      <p className="mt-3 text-sm text-gray-700">{text}</p>
    </div>
  )
}
