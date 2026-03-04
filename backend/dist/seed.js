"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function seedDatabase() {
    try {
        console.log('🔄 Poblando datos iniciales...');
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
    }
    catch (error) {
        console.error('❌ Error:', error);
    }
    finally {
        await prisma.$disconnect();
    }
}
seedDatabase();
//# sourceMappingURL=seed.js.map