import { Injectable } from '@nestjs/common';
import { Task } from './entities/task.entity';

@Injectable()
export class TasksService {
  private tasks: Task[] = [
    { id: 1, title: 'Tarea de ejemplo 1', description: 'Descripción 1', completed: false, dueDate: '2026-03-10' },
    { id: 2, title: 'Tarea completada', description: 'Descripción 2', completed: true, dueDate: '2026-03-05' },
  ];

  findAll(): Task[] {
    return this.tasks.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
  }
}