# gestion_tareas

Mini proyecto de Análisis de Sistemas I — sistema de gestión de tareas personales.

Descripción

Este repositorio contiene un módulo en TypeScript para gestionar una lista de tareas. El proyecto soporta operaciones de listar, agregar y eliminar tareas. Está pensado como ejercicio colaborativo para un equipo: cada miembro puede trabajar en una historia de usuario y apuntar a la misma base de datos compartida.

Comandos básicos:

```bash
npm install
npm run build
npm start -- listar
```

## Interfaz Gráfica Web (GUI)

Puedes utilizar una interfaz web moderna y amigable para gestionar tareas en lugar de la CLI:

```bash
npm install
npm run build
npm start:gui
# Abre http://localhost:3000 en el navegador
```

La interfaz incluye:
- 📋 Vista de todas tus tareas
- ➕ Agregar tareas fácilmente
- 🗑️ Eliminar tareas con confirmación
- 📊 Estadísticas en tiempo real (total, completadas, pendientes)
- 📱 Diseño responsive (funciona en móviles)
- ✨ Interfaz moderna y fluida

### Comandos disponibles en CLI:

- `listar`: muestra todas las tareas.
- `eliminar <id>`: elimina la tarea con el identificador indicado.
- `agregar "Descripción"`: añade una nueva tarea con la descripción dada.

Ejemplos

Compilar y listar:

```bash
npm run build
npm start -- listar
```

Eliminar la tarea con id 2:

```bash
npm run build
npm start -- eliminar 2
```

Agregar una tarea:

```bash
npm run build
npm start -- agregar "Repasar para la entrega"
```

Requisitos

- Node.js (incluye `npm`). Si no está instalado en Windows, puede usar `winget install OpenJS.NodeJS` o descargar el instalador desde https://nodejs.org.

Notas

El proyecto puede conectarse a una base de datos PostgreSQL compartida del equipo. Las credenciales y el host se pueden configurar mediante `DATABASE_URL` o variables de entorno (`DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`). Ten en cuenta que operar sobre una BD compartida modifica datos visibles por todo el equipo.

Para más detalles sobre la conexión y el esquema requerido revisa el código en `src/db.ts` y `src/tareas.ts`.
