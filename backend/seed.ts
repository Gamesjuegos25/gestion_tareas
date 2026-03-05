import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedDatabase() {
  try {
    console.log('🔄 Poblando datos iniciales...');
    
    // Crear estados de tarea
    const estados = await prisma.estados_tarea.createMany({
      data: [
        { nombre: 'Pendiente' },
        { nombre: 'En Progreso' },
        { nombre: 'Completado' },
        { nombre: 'Cancelado' }
      ],
      skipDuplicates: true
    });
    console.log('✅ Estados creados/verificados');
    
    // Crear prioridades
    const prioridades = await prisma.prioridades.createMany({
      data: [
        { nombre: 'Baja' },
        { nombre: 'Media' },
        { nombre: 'Alta' },
        { nombre: 'Crítica' }
      ],
      skipDuplicates: true
    });
    console.log('✅ Prioridades creadas/verificadas');
    
    console.log('🎯 Base de datos lista para el US-01 ✅');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedDatabase();