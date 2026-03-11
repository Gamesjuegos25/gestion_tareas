import { Controller, Get, Post, Patch, Param, Body, Delete, BadRequestException } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { EditarTareaDto } from '../editartarea.dto'; 

// 1. IMPORTAMOS EL DTO DE TU COMPAÑERO EN INGLÉS
import { CreateTaskDto } from './dto/create-task.dto';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  findAll() {
    return this.tasksService.findAll();
  }

  // 2. USAMOS LA VALIDACIÓN Y EL DTO DE TU COMPAÑERO PARA EL POST
  @Post()
  create(@Body() createTaskDto: CreateTaskDto) {
    if (createTaskDto.dueDate) {
      const parts = String(createTaskDto.dueDate).split('-').map(Number);
      if (parts.length === 3) {
        const [y, m, d] = parts;
        const input = new Date(y, m - 1, d);
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        if (input < today) {
          throw new BadRequestException('La fecha límite no puede ser anterior a la fecha actual');
        }
      }
    }

    return this.tasksService.create(createTaskDto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateData: EditarTareaDto) {
    return this.tasksService.update(+id, updateData);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tasksService.remove(+id);
  }
}