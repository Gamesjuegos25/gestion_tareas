import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function createSampleTasks() {
  try {
    console.log('🔄 Creando tareas de ejemplo para el tablero Kanban...');
    
    // Obtener IDs de estados
    const estadoPendiente = await prisma.estados_tarea.findFirst({ where: { nombre: 'Pendiente' } });
    const estadoProgreso = await prisma.estados_tarea.findFirst({ where: { nombre: 'En Progreso' } });
    const estadoCompletado = await prisma.estados_tarea.findFirst({ where: { nombre: 'Completado' } });
    
    if (!estadoProgreso) {
      await prisma.estados_tarea.create({ data: { nombre: 'En Progreso' } });
    }
    if (!estadoCompletado) {
      await prisma.estados_tarea.create({ data: { nombre: 'Completado' } });
    }
    
    // Refrescar estadoss
    const estados = await prisma.estados_tarea.findMany();
    const pendiente = estados.find(e => e.nombre === 'Pendiente');
    const progreso = estados.find(e => e.nombre === 'En Progreso');
    const completado = estados.find(e => e.nombre === 'Completado');
    
    // Crear tareas en "En Progreso"
    await prisma.tareas.create({
      data: {
        titulo: 'Implementar autenticación',
        descripcion: 'Configurar login y registro de usuarios',
        fecha_limite: new Date('2026-03-12'),
        estado_id: progreso?.id,
      },
    });
    
    await prisma.tareas.create({
      data: {
        titulo: 'API de notificaciones',
        descripcion: 'Desarrollo del sistema de notificaciones',
        fecha_limite: new Date('2026-03-14'),
        estado_id: progreso?.id,
      },
    });
    
    // Crear tareas "Completadas"
    await prisma.tareas.create({
      data: {
        titulo: 'Setup del proyecto',
        descripcion: 'Configuración inicial del repositorio',
        fecha_limite: new Date('2026-03-05'),
        estado_id: completado?.id,
      },
    });
    
    await prisma.tareas.create({
      data: {
        titulo: 'Documentación base',
        descripcion: 'README y documentación inicial',
        fecha_limite: new Date('2026-03-06'),
        estado_id: completado?.id,
      },
    });
    
    console.log('✅ Tareas de ejemplo creadas para el tablero Kanban');
    console.log('🎯 Ahora tienes tareas en los 3 estados');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createSampleTasks();