import { CreateTaskDto } from './dto/create-task.dto';
import { TasksService } from './tasks.service';
export declare class TasksController {
    private readonly tasksService;
    constructor(tasksService: TasksService);
    findAll(): Promise<import("./entities/task.entity").Task[]>;
    create(taskDto: CreateTaskDto): Promise<{
        success: boolean;
        message: string;
    }>;
    updateTaskStatus(id: string, updateData: {
        estado: string;
    }): Promise<{
        success: boolean;
        message: string;
    }>;
}
