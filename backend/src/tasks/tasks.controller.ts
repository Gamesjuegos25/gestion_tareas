import { Controller, Get, Post, Body, BadRequestException } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  findAll() {
    return this.tasksService.findAll();
  }

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
    return this.tasksService.create(createTaskDto as any);
  }
}