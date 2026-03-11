# gestion_tareas
mini proyecto de Analisis de sistemas I sistema de gestion de tareas personales

Proyecto de ejemplo: backend (Nest + Prisma) y frontend (React + Vite).

Instrucciones rápidas:

- Backend:
	- Instalar dependencias: `cd backend && npm install`
	- Generar cliente Prisma: `npx prisma generate`
	- Ejecutar migraciones (si aplican): `npx prisma migrate deploy` o `npx prisma migrate dev`
	- Ejecutar seed: `node -r ts-node/register seed.ts` o `npm run start:dev`

- Frontend:
	- Instalar dependencias: `cd frontend && npm install`
	- Ejecutar en dev: `npm run dev`

API esperada: backend en `http://localhost:3000`, endpoint `GET/POST /tasks`.

Nota: He eliminado artefactos de build y archivos no usados en frontend.
