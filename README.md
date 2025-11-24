# AlmasEnAcción – Frontend

Plataforma web para coordinar voluntariado y actividades comunitarias. Conecta personas con causas, facilita la inscripción, la gestión y la comunicación con transparencia.

Sitio de producción (GitHub Pages): `https://samuelmenan.github.io/AlmasEnAccion`

## Objetivo del proyecto

- Centralizar la publicación de actividades y la participación de voluntarios.
- Proveer una experiencia clara, accesible y responsive.
- Integrarse con un backend seguro (JWT, roles) y notificaciones en tiempo real.

## Funcionalidades principales

- Registro e inicio de sesión con JWT.
- Listado y detalle de actividades.
- Inscripción y desinscripción de voluntarios.
- Perfil de usuario y gestión básica.
- Notificaciones en tiempo real (SSE) con contador de no leídos.
- Roles y permisos: `VOLUNTARIO`, `COORDINADOR`, `ADMIN`.

## Arquitectura

- Frontend: React + TypeScript + Vite + Tailwind + React Router + Zustand.
- Backend: Spring Boot + MongoDB + JWT (repo: `AlmasEnAccionBackend`).
- Comunicación: REST + SSE (`/notifications/stream`).

## Flujo de usuario

1. Usuario se registra o inicia sesión.
2. Accede al listado de actividades y se inscribe/desinscribe.
3. Recibe notificaciones (inscripciones, cancelaciones, nuevas actividades).
4. Revisa su perfil e historial.

## Instalación y ejecución

Requisitos: Node.js 18+, npm 9+.

```
npm install
npm run dev
```

La app abre en `http://localhost:5173` (o puerto alterno disponible).

## Configuración de entorno

Crear `.env` en la raíz:

- `VITE_API_URL` — base del API. Ejemplo: `http://localhost:8080/api/v1`.

Si no se define, algunos módulos usan `http://localhost:8080/api/v1` por defecto.

## Build y preview

```
npm run build
npm run preview
```

`preview` sirve `dist/` para validar el build de producción.

## Estructura de carpetas

- `src/components/layout/` — Header, Footer, layout principal.
- `src/components/common/` — componentes reutilizables (botones, campana, etc.).
- `src/pages/` — vistas: `Home`, `ActivitiesList`, `ActivityDetail`, `Profile`, `Login`, `Register`.
- `src/context/AuthContext.tsx` — estado de sesión y roles.
- `src/store/notifications.ts` — estado y SSE de notificaciones.
- `src/lib/api.ts` — cliente Axios.

## Integración con backend

- JWT en `localStorage` como `aea_token`.
- Endpoints bajo `VITE_API_URL` (`/auth`, `/activities`, `/notifications`, `/profile`).
- SSE: `GET /notifications/stream` con autenticación.

## Accesibilidad y diseño

- Tailwind con paleta `primary-*` coherente.
- Controles con `aria-label`, roles y foco visibles.
- Responsive móvil/tablet/desktop.

## Scripts útiles

- `npm run lint` — análisis estático.
- `npm run lint:fix` — autocorrección.
- `npm run format` — formatea con Prettier.
- `npm run format:check` — verifica formato.
- `npm run check` — chequeo de tipos.
- `npm run deploy` — publica a GitHub Pages.

## Despliegue

El repositorio está configurado para GitHub Pages. Ejecuta:

```
npm run deploy
```

Publica el build a la rama `gh-pages` y queda accesible en la URL configurada.

## Seguridad

- No almacenar secretos en el repositorio.
- Usar `VITE_API_URL` para separar entornos (dev/prod).
- JWT protegido en peticiones; no exponerlo en logs.

## Roadmap

- Filtrado avanzado de actividades.
- Estadísticas de impacto.
- Preferencias de notificaciones.

## Licencia

Proyecto interno. Derechos reservados © AlmasEnAcción.
