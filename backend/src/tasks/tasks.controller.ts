import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { Task } from './entities/task.entity';
import { CreateTaskDto } from './dto/create-task.dto';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  findAll() {
    return this.tasksService.findAll();
  }

  @Post()
  create(@Body() task: CreateTaskDto) {
    return this.tasksService.create(task);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updatedTask: Partial<Task>) {
    return this.tasksService.update(Number(id), updatedTask);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tasksService.remove(Number(id));
  }

  @Put(':id/columna')
  moveToColumn(@Param('id') id: string, @Body('columna') columna: string) {
    return this.tasksService.moveToColumn(Number(id), columna);
  }
}