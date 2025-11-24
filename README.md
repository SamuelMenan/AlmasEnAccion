# AlmasEnAcción – Frontend

Aplicación web moderna en React + TypeScript + Vite. Incluye autenticación JWT, enrutamiento, notificaciones en tiempo real (SSE), estilos con Tailwind y estado con Zustand.

## Stack

- React 18
- TypeScript
- Vite 6
- Tailwind CSS 3
- React Router 7
- Zustand
- Axios

## Requisitos

- Node.js 18 o superior
- npm 9 o superior

## Instalación

```
npm install
```

## Desarrollo

```
npm run dev
```

La app se abre en `http://localhost:5173` (o puerto alterno si está ocupado).

## Variables de entorno

Crear `.env` en la raíz y definir:

- `VITE_API_URL` — base del API, por ejemplo `http://localhost:8080/api/v1`

Si no se define, se usa `http://localhost:8080/api/v1` por defecto en algunos componentes.

## Build y preview

```
npm run build
npm run preview
```

`preview` sirve el contenido de `dist/` en un servidor local para ver el build.

## Scripts útiles

- `npm run lint` — análisis estático con ESLint
- `npm run lint:fix` — corrige problemas automáticos
- `npm run format` — formatea con Prettier
- `npm run format:check` — verifica formato
- `npm run check` — comprobación de tipos con `tsc`
- `npm run deploy` — publica a GitHub Pages (usa `predeploy` → `build`)

## Integración con backend

- Autenticación: se espera un JWT en `localStorage` (`aea_token`)
- Endpoints bajo `VITE_API_URL` (por ejemplo `/auth`, `/activities`, `/notifications`)
- Notificaciones: SSE en `/notifications/stream` utilizando el JWT

## Estructura principal

- `src/components/layout/` — `Header`, `Footer`, layout general
- `src/components/common/` — botones, rutas protegidas, campana de notificaciones
- `src/pages/` — vistas como `Home`, `ActivitiesList`, etc.
- `src/context/AuthContext.tsx` — sesión, roles, JWT
- `src/store/notifications.ts` — estado y conexión SSE
- `src/lib/api.ts` — cliente Axios

## Estilos y diseño

- Tailwind con clases utilitarias y paleta primaria `primary-*`
- Componentes con accesibilidad (`aria-label`, `role="button"`, etc.)
- Responsive para móvil, tablet y desktop

## Despliegue en GitHub Pages

1. Configurar el repositorio con Pages (branch `gh-pages`)
2. Ejecutar:

```
npm run deploy
```

El build se publica en la rama `gh-pages` y queda disponible en la URL configurada.

## Buenas prácticas

- No almacenar secretos en el repositorio
- Usar `VITE_API_URL` para apuntar a distintos entornos
- Mantener `eslint` y `prettier` en verde antes de publicar

## Licencia

Proyecto interno. Derechos reservados © AlmasEnAcción.
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
