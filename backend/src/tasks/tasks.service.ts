import { Injectable } from '@nestjs/common';
import { Task } from './entities/task.entity';

@Injectable()
export class TasksService {
  private tasks: Task[] = [];

  findAll(): Task[] {
    return this.tasks;
  }

  create(task: Omit<Task, 'id'>): Task {
    const newTask: Task = {
      ...task,
      id: Date.now(),
    };
    this.tasks.push(newTask);
    return newTask;
  }

  update(id: number, updatedTask: Partial<Task>): Task | undefined {
    const idx = this.tasks.findIndex(t => t.id === id);
    if (idx === -1) return undefined;
    this.tasks[idx] = { ...this.tasks[idx], ...updatedTask };
    return this.tasks[idx];
  }

  remove(id: number): boolean {
    const prevLen = this.tasks.length;
    this.tasks = this.tasks.filter(t => t.id !== id);
    return this.tasks.length < prevLen;
  }

  moveToColumn(id: number, columna: string): Task | undefined {
    return this.update(id, { columna });
  }
}