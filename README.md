# Task Filter (TypeScript)

Este pequeño proyecto permite filtrar tareas por estado desde una base de datos PostgreSQL.

Archivos creados:


Rápido inicio:

1) Instala dependencias:

```bash
npm install
```

2) Copia `.env.example` a `.env` y ajusta credenciales si es necesario.

3) Ejecuta en desarrollo (requiere `ts-node`):

```bash
npm run dev -- pendiente
```

o especificando opciones:

```bash
npm run dev -- --status=pendiente --table=tareas --column=estado
```

4) Para producción genera JS y ejecuta:

```bash
npm run build
npm start -- pendiente
```

Notas:

Interfaz gráfica (web)

1) Arranca el servidor de desarrollo (sirve la UI estática y el endpoint API):

```bash
npm run dev-server
```

2) Abre `http://localhost:3000` en tu navegador y usa el formulario para buscar por estado.

El endpoint HTTP es `GET /api/tasks?status=<estado>&table=<tabla>&column=<columna>`.

Uso con Docker

1) Construir y arrancar con Docker Compose:

```bash
docker compose up --build -d
```

2) Ver logs:

```bash
docker compose logs -f
```

3) Parar y eliminar contenedores:

```bash
docker compose down
```

Nota: `docker-compose.yml` usa el archivo `.env` para las variables de conexión a la base de datos.
