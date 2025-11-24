import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter } from 'lucide-react';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const [policy, setPolicy] = useState<null | 'privacy' | 'terms'>(null);

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">AlmasEnAcción</h3>
            <p className="text-gray-300">Plataforma para coordinar voluntariado y actividades con transparencia.</p>
            <div className="mt-4 flex items-center gap-3">
              <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook" className="h-9 w-9 inline-flex items-center justify-center rounded-md text-white/90 ring-1 ring-primary-200 hover:bg-primary-50 hover:text-primary-700 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram" className="h-9 w-9 inline-flex items-center justify-center rounded-md text-white/90 ring-1 ring-primary-200 hover:bg-primary-50 hover:text-primary-700 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="https://x.com" target="_blank" rel="noreferrer" aria-label="Twitter" className="h-9 w-9 inline-flex items-center justify-center rounded-md text-white/90 ring-1 ring-primary-200 hover:bg-primary-50 hover:text-primary-700 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Secciones</h4>
            <ul className="space-y-2">
              <li><Link to="/activities" className="text-gray-300 hover:text-white transition-colors">Actividades</Link></li>
              <li><Link to="/history" className="text-gray-300 hover:text-white transition-colors">Historial</Link></li>
              <li><Link to="/profile" className="text-gray-300 hover:text-white transition-colors">Perfil</Link></li>
              <li><Link to="/login" className="text-gray-300 hover:text-white transition-colors">Iniciar sesión</Link></li>
              <li><Link to="/register" className="text-gray-300 hover:text-white transition-colors">Registrarse</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Contacto</h4>
            <ul className="space-y-2">
              <li><a href="mailto:contacto@almasenaccion.org" className="text-gray-300 hover:text-white transition-colors">contacto@almasenaccion.org</a></li>
              <li><a href="https://wa.me/573001234567" target="_blank" rel="noreferrer" className="text-gray-300 hover:text-white transition-colors">WhatsApp</a></li>
              <li><a href="tel:+573001234567" className="text-gray-300 hover:text-white transition-colors">+57 300 123 4567</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Legal</h4>
            <ul className="space-y-2">
              <li>
                <button onClick={() => setPolicy('privacy')} className="text-gray-300 hover:text-white transition-colors">Política de privacidad</button>
              </li>
              <li>
                <button onClick={() => setPolicy('terms')} className="text-gray-300 hover:text-white transition-colors">Términos de servicio</button>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-300">© {currentYear} AlmasEnAcción. Todos los derechos reservados.</p>
          <div className="text-xs text-gray-400">Construido con React, TypeScript y Tailwind CSS.</div>
        </div>
      </div>

      {policy && (
        <div role="dialog" aria-modal="true" className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="max-w-xl w-full rounded-lg bg-white text-gray-900 shadow-lg">
            <div className="flex items-center justify-between px-4 py-3 border-b">
              <p className="font-semibold">{policy === 'privacy' ? 'Política de privacidad' : 'Términos de servicio'}</p>
              <button onClick={() => setPolicy(null)} className="h-9 px-3 rounded-md text-sm font-medium text-gray-700 hover:text-primary-600 hover:bg-primary-50 hover:ring-1 hover:ring-primary-200">Cerrar</button>
            </div>
            <div className="p-4 text-sm space-y-3">
              <p className="text-gray-700">Este proyecto protege tus datos y los utiliza únicamente para gestionar tu participación en actividades. Puedes solicitar la eliminación de tu información escribiendo a contacto@almasenaccion.org.</p>
              <p className="text-gray-700">Al usar la aplicación aceptas las reglas de participación y el uso responsable de la plataforma. Las actividades pueden requerir verificación de identidad.</p>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
};
