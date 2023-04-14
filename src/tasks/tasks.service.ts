import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TaskStatus } from './task-status.enum';
import { CreateTaskDto } from './dtos/create-task.dto';
import { UpdateTaskDto } from './dtos/update-task.dto';
import { GetTaskFilterDto } from './dtos/get-tasks-filter.dto';
import { UpdateStatusDto } from './dtos/update-status.dto';
import { TasksRepository } from './tasks.repository';
import { Task } from './task.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task) private readonly tasksRepository: TasksRepository,
  ) {}

  async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    const { title, description } = createTaskDto;

    const task = this.tasksRepository.create({
      title,
      description,
      status: TaskStatus.OPEN,
    });

    await this.tasksRepository.save(task);
    return task;
  }

  async getTasks(filterDto: GetTaskFilterDto): Promise<Task[]> {
    const { status, search } = filterDto;

    const query = this.tasksRepository.createQueryBuilder('task');

    if (status) {
      query.andWhere('task.status = :statusFilter', { statusFilter: status });
    }

    if (search) {
      const lowerCasedSearchFilterQuery = 'LIKE LOWER(:searchFilter)';
      query.andWhere(
        `LOWER(task.title) ${lowerCasedSearchFilterQuery} OR LOWER(task.description) ${lowerCasedSearchFilterQuery}`,
        { searchFilter: `%${search}%` },
      );
    }

    const tasks = await query.getMany();

    return tasks;
  }

  async getTaskById(id: string): Promise<Task> {
    const found = await this.tasksRepository.findOne({ where: { id } });

    if (!found) throw new NotFoundException(`Task with ID ${id} not found`);

    return found;
  }

  async deleteTaskById(id: string): Promise<void> {
    const deleted = await this.tasksRepository.delete(id);

    if (deleted.affected === 0)
      throw new NotFoundException(`Task with ID ${id} not found`);
    return;
  }

  async updateTaskStatusById(id: string, status: TaskStatus): Promise<Task> {
    const task = await this.getTaskById(id);

    task.status = status;
    await this.tasksRepository.save(task);

    return task;
  }

  // updateTaskById(id: string, updateTaskDto: UpdateTaskDto): Task {
  //   const index = this.tasks.findIndex((task) => task.id === id);
  //   if (index === -1) throw new NotFoundException();
  //   this.tasks[index] = {
  //     ...this.tasks[index],
  //     ...updateTaskDto,
  //   };
  //   return this.tasks[index];
  // }
}
