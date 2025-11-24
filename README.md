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

