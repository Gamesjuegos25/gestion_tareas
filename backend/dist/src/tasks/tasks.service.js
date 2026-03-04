"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TasksService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
let TasksService = class TasksService {
    prisma = new client_1.PrismaClient();
    async findAll() {
        const tareasPrisma = await this.prisma.tareas.findMany({
            include: {
                estados_tarea: true,
                prioridades: true
            }
        });
        return tareasPrisma.map(t => ({
            id: Number(t.id),
            title: t.titulo,
            description: t.descripcion,
            dueDate: t.fecha_limite.toISOString(),
            completed: t.estados_tarea?.nombre === 'Completado',
            estado: t.estados_tarea?.nombre || 'Pendiente',
        }));
    }
    async create(taskDto) {
        try {
            let estadoPendiente = await this.prisma.estados_tarea.findFirst({
                where: { nombre: 'Pendiente' }
            });
            if (!estadoPendiente) {
                estadoPendiente = await this.prisma.estados_tarea.create({
                    data: { nombre: 'Pendiente' }
                });
            }
            await this.prisma.tareas.create({
                data: {
                    titulo: taskDto.title,
                    descripcion: taskDto.description,
                    fecha_limite: new Date(taskDto.dueDate),
                    estado_id: estadoPendiente.id,
                },
            });
            return { success: true, message: '✅ Tarea creada exitosamente con estado "Pendiente"' };
        }
        catch (error) {
            console.error('Error al crear tarea:', error);
            return { success: false, message: '❌ Error al guardar la tarea en la base de datos.' };
        }
    }
    async updateTaskStatus(taskId, nuevoEstado) {
        try {
            const estado = await this.prisma.estados_tarea.findFirst({
                where: { nombre: nuevoEstado }
            });
            if (!estado) {
                return { success: false, message: `❌ Estado "${nuevoEstado}" no encontrado` };
            }
            await this.prisma.tareas.update({
                where: { id: BigInt(taskId) },
                data: { estado_id: estado.id }
            });
            return { success: true, message: `✅ Tarea actualizada a "${nuevoEstado}"` };
        }
        catch (error) {
            console.error('Error al actualizar tarea:', error);
            return { success: false, message: '❌ Error al actualizar la tarea en la base de datos.' };
        }
    }
};
exports.TasksService = TasksService;
exports.TasksService = TasksService = __decorate([
    (0, common_1.Injectable)()
], TasksService);
//# sourceMappingURL=tasks.service.js.map