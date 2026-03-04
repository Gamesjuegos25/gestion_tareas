import { Task } from './entities/task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
export declare class TasksService {
    private prisma;
    findAll(): Promise<Task[]>;
    create(taskDto: CreateTaskDto): Promise<{
        success: boolean;
        message: string;
    }>;
    updateTaskStatus(taskId: number, nuevoEstado: string): Promise<{
        success: boolean;
        message: string;
    }>;
}
