import { Controller, Get, Post, Patch, Param, Body, Delete } from '@nestjs/common';
import { TasksService } from './tasks.service';
// 1. Asegúrate de importar ambos aquí:
import { EditarTareaDto } from '../editartarea.dto'; 
import { CrearTareaDto } from '../cambiarestado.dto'; 

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  findAll() {
    return this.tasksService.findAll();
  }

  // 2. CAMBIO AQUÍ: Usa CrearTareaDto para el método POST
  @Post()
  create(@Body() createDatos: CrearTareaDto) {
    return this.tasksService.create(createDatos);
  }

  // 3. El PATCH sigue usando EditarTareaDto
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateData: EditarTareaDto) {
    return this.tasksService.update(+id, updateData);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tasksService.remove(+id);
  }
}