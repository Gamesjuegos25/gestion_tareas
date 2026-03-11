**Frontend file map**

- `src/components/TaskForm.tsx`: Componente UI que muestra el formulario (título, descripción, fecha) y envía la petición de creación. Resetea campos y notifica al padre cuando se crea una tarea.
- `src/api/tasks.ts`: Lógica de comunicación con el backend. Exporta `fetchTasks()` y `createTask()` para centralizar llamadas HTTP.
- `src/TaskList.tsx`: Contenedor de la vista. Renderiza `TaskForm`, obtiene tareas usando el API service y muestra solo las tareas pendientes.
 - `src/api/tasks.ts`: Lógica de comunicación con el backend. Exporta `createTask()` para centralizar la llamada HTTP de inserción. (Se eliminó la dependencia del GET en el frontend.)
 - `src/TaskList.tsx`: Contenedor de la vista simplificado: solo renderiza `TaskForm` y muestra una confirmación al crear.
- `src/main.tsx`: Punto de entrada de la app (Vite + React).
- `index.html`, `src/index.css`: Plantilla y estilos básicos.

**Backend file map (relevante)**

- `src/prisma/prisma.service.ts`: Wrapper `PrismaService` para inyectar el cliente Prisma en Nest.
- `src/prisma/prisma.module.ts`: Módulo global que provee `PrismaService`.
- `src/tasks/tasks.service.ts`: Servicio de tareas que ahora persiste con Prisma (métodos `findAll()` y `create()`).
- `src/tasks/dto/create-task.dto.ts`: DTO que valida la entrada esperada al crear una tarea (`title`, `description`, `dueDate`).
- `src/tasks/tasks.controller.ts`: Endpoints `GET /tasks` y `POST /tasks`.
 - `src/tasks/tasks.service.ts`: Servicio de tareas que ahora persiste con Prisma (método `create()`).
 - `src/tasks/tasks.controller.ts`: Endpoint `POST /tasks` (GET eliminado por simplificación).
- `seed.ts` y `sample-tasks.ts`: Scripts para poblar datos iniciales (estados, prioridades y tareas de ejemplo).

Nota: El backend asigna por defecto el estado `Pendiente` al crear una tarea. El frontend envía `estado: 'Pendiente'` también por claridad, pero el servidor mantiene la referencia real en la base de datos.
