# AlmasEnAcción Backend

Servicio backend de AlmasEnAcción construido con Spring Boot (Java), MongoDB y JWT. Expone APIs para autenticación, actividades, inscripciones, perfil y notificaciones en tiempo real (SSE).

## Stack

- Java 17, Spring Boot
- MongoDB
- JWT para autenticación
- Spring Security
- Spring Mail (para verificación de cuenta)
- SSE (Server‑Sent Events) para notificaciones

## Requisitos

- Java 17
- Maven 3.9+
- MongoDB en `mongodb://localhost:27017` o variable `SPRING_DATA_MONGODB_URI`

## Configuración (application.yml)

Variables principales (puedes definirlas como variables de entorno):

- `SPRING_DATA_MONGODB_URI` (por defecto `mongodb://localhost:27017/almasenaccion`)
- `PORT` (por defecto `8080`)
- `JWT_SECRET` (por defecto incluido en `application.yml` para desarrollo)
- `MAIL_HOST`, `MAIL_PORT`, `MAIL_USER`, `MAIL_PASSWORD` (opcional)

Swagger UI: `http://localhost:8080/swagger-ui.html`

## Ejecutar en desarrollo

```bash
mvn clean package
mvn spring-boot:run
# o
java -jar target/almasenaccion-0.0.1-SNAPSHOT.jar
```

## Endpoints principales

- Autenticación (`/api/v1/auth`)
  - `POST /register` — registro de usuario
  - `GET  /verify?token=...` — verificación de cuenta
  - `POST /login` — login, devuelve JWT

- Actividades (`/api/v1/activities`)
  - `GET /` — lista de actividades
  - `POST /` — crear actividad (roles `COORDINADOR` o `ADMIN`)

- Notificaciones (`/api/v1/notifications`)
  - `GET /` — últimas 10 notificaciones del usuario
  - `GET /unread/count` — contador de no leídas
  - `POST /{id}/read` — marcar como leída
  - `GET /stream` — SSE de notificaciones

- Perfil (`/api/v1/profile`) y Enrollments (`/api/v1/enrollments`) disponibles según controladores.

## Seguridad

- Autenticación vía JWT en encabezado `Authorization: Bearer <token>`.
- Roles normalizados a `VOLUNTARIO`, `COORDINADOR`, `ADMIN`.

## Desarrollo

- Perfil `dev`: logging `DEBUG`.
- Perfil `test`: base `mongodb://localhost:27017/test`.
- Perfil `prod`: requiere `SPRING_DATA_MONGODB_URI`.

## Licencia

Proyecto interno. Derechos reservados © AlmasEnAcción.

