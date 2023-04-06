import { Injectable, NotFoundException } from '@nestjs/common';
import { Task, TaskStatus } from './task.model';
import { v4 as uuidv4 } from 'uuid';
import { CreateTaskDto } from './dtos/create-task.dto';
import { UpdateTaskDto } from './dtos/update-task.dto';
import { GetTaskFilterDto } from './dtos/get-tasks-filter.dto';
import { UpdateStatusDto } from './dtos/update-status.dto';

@Injectable()
export class TasksService {
  private tasks: Task[] = [];

  getAllTasks(): Task[] {
    return this.tasks;
  }

  getTasksWithFilter(filterDto: GetTaskFilterDto): Task[] {
    const { status, search } = filterDto;

    let tasks = this.getAllTasks();

    if (status) {
      tasks = tasks.filter((task) => task.status === status);
    }

    if (search) {
      tasks = tasks.filter((task) => {
        if (task.title.includes(search) || task.description.includes(search)) {
          return task;
        }
      });
    }

    return tasks;
  }

  createTask(createTaskDto: CreateTaskDto): Task {
    const task: Task = {
      id: uuidv4(),
      title: createTaskDto.title,
      description: createTaskDto.description,
      status: TaskStatus.OPEN,
    };

    this.tasks.push(task);
    return task;
  }

  getTaskById(id: string): Task {
    const task = this.tasks.find((task) => task.id === id);

    if (!task) throw new NotFoundException();

    return task;
  }

  updateTaskById(id: string, updateTaskDto: UpdateTaskDto): Task {
    const index = this.tasks.findIndex((task) => task.id === id);

    if (index === -1) throw new NotFoundException();

    this.tasks[index] = {
      ...this.tasks[index],
      ...updateTaskDto,
    };

    return this.tasks[index];
  }

  updateStatusByTaskId(id: string, updateTaskStatusDto: UpdateStatusDto): Task {
    const task = this.getTaskById(id);
    task.status = updateTaskStatusDto.status;

    return task;
  }

  removeTaskById(id: string): void {
    const found = this.getTaskById(id);
    this.tasks = this.tasks.filter((task) => task.id !== found.id);
  }
}
