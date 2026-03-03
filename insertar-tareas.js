const { Pool } = require('pg');

(async () => {
  const pool = new Pool({
    host: 'dpg-d6i7topaae7s73cbr96g-a.oregon-postgres.render.com',
    port: 5432,
    database: 'gestion_tareas_v1kx',
    user: 'pedro',
    password: '1234',
    ssl: { rejectUnauthorized: false }
  });

  try {
    console.log('📝 Insertando nuevas tareas...\n');

    const query = `
      INSERT INTO tareas (
        proyecto_id,
        miembro_id,
        titulo,
        descripcion,
        fecha_limite,
        estado_id,
        prioridad_id,
        creado_en,
        actualizado_en
      ) VALUES
        (NULL, NULL, 'Revisar informe mensual', 'Leer y comentar el informe de marzo', '2026-03-10', 1, NULL, NOW(), NOW()),
        (NULL, NULL, 'Organizar reunión equipo', 'Enviar invitaciones y preparar agenda', '2026-03-05', 1, NULL, NOW(), NOW()),
        (NULL, NULL, 'Actualizar documentación', 'Subir manuales al repositorio', '2026-03-08', 1, NULL, NOW(), NOW()),
        (NULL, NULL, 'Backup de base de datos', 'Realizar copia de seguridad semanal', '2026-03-07', 1, NULL, NOW(), NOW())
      RETURNING id, titulo, estado_id;
    `;

    const result = await pool.query(query);
    console.log('✅ Se insertaron ' + result.rows.length + ' tareas:\n');
    console.table(result.rows);

    console.log('\n📋 Mostrando todas las tareas en la BD:\n');
    const allTareas = await pool.query('SELECT id, titulo, descripcion, fecha_limite, estado_id FROM tareas ORDER BY id DESC LIMIT 10');
    console.table(allTareas.rows);

  } catch (err) {
    console.error('❌ Error:', err.message);
  } finally {
    await pool.end();
  }
})();
