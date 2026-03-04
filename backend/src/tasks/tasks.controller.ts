import { Controller, Get, Post, Patch, Param, Body } from '@nestjs/common';
import { TasksService } from './tasks.service';

// Importamos el DTO que elegimos usar para crear tareas con fecha
import { EditarTareaDto } from '../editartarea.dto'; 

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  // 1. Obtener todas las tareas (US-03)
  @Get()
  findAll() {
    return this.tasksService.findAll();
  }

  // 2. Crear una tarea nueva (US-04) <-- ¡ESTA ES LA NUEVA RUTA!
  @Post()
  create(@Body() createDatos: EditarTareaDto) {
    return this.tasksService.create(createDatos);
  }

  // 3. Modificar/Mover una tarea existente (US-05)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateData: any) {
    return this.tasksService.update(+id, updateData);
  }
}