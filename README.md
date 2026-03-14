# Gestión de Tareas — Especificación técnica

Este documento presenta la especificación técnica del proyecto, preparada para revisión por un ingeniero. Contiene: descripción del sistema, dependencias, estructuras de datos, contratos de la API, variables de entorno, instrucciones reproducibles para desarrollo y despliegue, y criterios de calidad.

## Resumen del sistema

- Backend: NestJS (módulos, controladores, servicios), TypeORM para acceso a datos.
- Frontend: React (Vite + TypeScript) con `react-hook-form` y `zod` para validación.
- Persistencia: PostgreSQL (paquete `pg`), mapeo con TypeORM.

## Requisitos

- Node.js >= 18
- npm o pnpm
- PostgreSQL 12+ o contenedor Docker de PostgreSQL

## Estructura del repositorio (principal)

- `backend/` — servidor NestJS
  - `backend/package.json`
  - `backend/src/main.ts` — bootstrap y CORS
  - `backend/src/app.module.ts` — configuración de módulos
  - `backend/src/tasks/` — módulo de tareas (controlador, servicio, entidad y DTOs)

- `frontend/` — cliente React con Vite
  - `frontend/package.json`
  - `frontend/src/` — componentes, llamadas a la API y estilos

- Archivos de documentación y tests en la raíz.

## Esquema de la entidad `Task` (tabla: `tareas`)

La entidad TypeORM `Task` se define en `backend/src/tasks/entities/task.entity.ts` y mapea la tabla `tareas`. Campos principales:

- `id` (number, PK, autoincremental)
- `proyecto_id` (bigint, opcional) — identificador del proyecto asociado
- `miembro_id` (bigint, opcional) — identificador del miembro asignado
- `titulo` (varchar(150), requerido) — título de la tarea
- `descripcion` (text, opcional) — descripción detallada
- `fecha_limite` (date, opcional) — fecha límite
- `estado_id` (bigint, opcional) — referencia a estado (pendiente, en progreso, completado)
- `prioridad_id` (bigint, opcional) — referencia a prioridad
- `creado_en` (timestamp, creado automáticamente)
- `actualizado_en` (timestamp, actualizado automáticamente)

Nota: los nombres de columna están en español por convención del proyecto. 

## DTOs y contrato de datos

Los DTOs se ubican en `backend/src/tasks/dto/` y definen la validación de entrada. Contratos relevantes:

- CreateTaskDto (ejemplo de campos aceptados):
  - `titulo` (string, obligatorio)
  - `descripcion` (string, opcional)
  - `fecha_limite` (string con formato `YYYY-MM-DD`, opcional)
  - `proyecto_id`, `miembro_id`, `estado_id`, `prioridad_id` (números, opcionales)

- Update/Editar DTO: campos opcionales para actualización parcial.

Validación adicional implementada en `TasksController`:
- Si `fecha_limite` está presente y es anterior a la fecha actual, la petición es rechazada con 400 Bad Request.

## API REST — Contratos y ejemplos

Base URL: `http://{HOST}:{PORT}` (por defecto `http://localhost:3000`)

1) GET /tasks
   - Código: 200
   - Respuesta: array de objetos `Task` con todos los campos de la entidad.

2) POST /tasks
   - Código: 201 (creado) o 400 (validación)
   - Request JSON (ejemplo):

```json
{
  "titulo": "Enviar informe",
  "descripcion": "Enviar reporte mensual",
  "fecha_limite": "2026-12-31",
  "proyecto_id": 10,
  "miembro_id": 5,
  "estado_id": 1,
  "prioridad_id": 2
}
```

   - Respuesta: objeto `Task` creado (incluye `id`, `creado_en`, `actualizado_en`).

3) PATCH /tasks/:id
   - Código: 200 (ok) o 404 (no encontrado) o 400 (validación)
   - Request JSON: campos a modificar (parciales).

4) DELETE /tasks/:id
   - Código: 200/204 (eliminado) o 404 (no encontrado)

Ejemplos de uso (CLI):

```bash
# Crear
curl -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -d '{"titulo":"Prueba","descripcion":"Demo","fecha_limite":"2026-12-31"}'

# Listar
curl http://localhost:3000/tasks

# Actualizar
curl -X PATCH http://localhost:3000/tasks/1 -H "Content-Type: application/json" -d '{"titulo":"Modificada"}'

# Eliminar
curl -X DELETE http://localhost:3000/tasks/1
```

## Variables de entorno (archivo: `backend/.env`)

Ejemplo de variables necesarias para ejecutar el backend en desarrollo:

```
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASS=postgres
DB_NAME=gestion_tareas
```

Configurar la conexión de TypeORM en `AppModule` o en el archivo de configuración correspondiente para usar estas variables.

## Instrucciones reproducibles — Desarrollo local

1. Preparar código y dependencias:

```bash
git clone <repo-url>
cd gestion_tareas-TestMerge

# Backend
cd backend
npm install

# Frontend (en otra terminal)
cd ../frontend
npm install
```

2. Levantar servicios en desarrollo:

```bash
# Backend
cd backend
npm run start:dev

# Frontend
cd ../frontend
npm run dev
```

El backend se expone por defecto en `http://localhost:3000` y el frontend en `http://localhost:5173`.

## Contenerización y orquestación (desarrollo)

Archivo de ejemplo `docker-compose.yml` (uso en entorno de desarrollo):

```yaml
version: "3.8"
services:
  db:
    image: postgres:15
    environment:
      POSTGRES_DB: gestion_tareas
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    ports:
      - "5432:5432"
    volumes:
      - db_data:/var/lib/postgresql/data

  backend:
    build: ./backend
    command: npm run start:dev
    working_dir: /app
    volumes:
      - ./backend:/app
      - /app/node_modules
    ports:
      - "3000:3000"
    environment:
      - PORT=3000
      - DB_HOST=db
      - DB_PORT=5432
      - DB_USER=postgres
      - DB_PASS=postgres
      - DB_NAME=gestion_tareas
    depends_on:
      - db

  frontend:
    build: ./frontend
    command: npm run dev -- --host
    working_dir: /app
    volumes:
      - ./frontend:/app
      - /app/node_modules
    ports:
      - "5173:5173"
    depends_on:
      - backend

volumes:
  db_data:
```

Nota: este `docker-compose.yml` es un ejemplo para desarrollo que monta volumenes de código y expone puertos locales.

## Pruebas y calidad

- Ejecutar tests backend:

```bash
cd backend
npm run test
npm run test:e2e
```

- Linters y formateo (backend):

```bash
cd backend
npm run lint
npm run format
```


## Puntos a tener en cuenta

- La API debe respetar los contratos descritos y devolver códigos HTTP apropiados.
- La validación de `fecha_limite` debe rechazar fechas pasadas en `POST` y `PATCH` cuando aplique.
- La entidad `Task` debe persistir metadatos `creado_en` y `actualizado_en` automáticamente.

## Contribución y control de cambios

- Flujo: ramas por feature (`feature/...`), PR con descripción y pasos de prueba.
- Mantener tests y linters verdes antes de merge.

