import {
  Controller,
  Body,
  Param,
  Query,
  Get,
  Post,
  Patch,
  Delete,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { Task } from './task.model';
import { CreateTaskDto } from './dtos/create-task.dto';
import { UpdateTaskDto } from './dtos/update-task.dto';
import { GetTaskFilterDto } from './dtos/get-tasks-filter.dto';
import { UpdateStatusDto } from './dtos/update-status.dto';

@Controller('tasks')
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Get('/')
  getTasks(@Query() filterDto: GetTaskFilterDto): Task[] {
    if (Object.keys(filterDto).length) {
      return this.tasksService.getTasksWithFilter(filterDto);
    }

    return this.tasksService.getAllTasks();
  }

  @Post('/')
  createTask(@Body() body: CreateTaskDto): Task {
    return this.tasksService.createTask(body);
  }

  @Get('/:id')
  getTaskById(@Param('id') id: string): Task {
    return this.tasksService.getTaskById(id);
  }

  @Patch('/:id')
  updateTaskById(@Param('id') id: string, @Body() body: UpdateTaskDto): Task {
    return this.tasksService.updateTaskById(id, body);
  }

  @Patch('/:id/status')
  updateStatusByTaskId(
    @Param('id') id: string,
    @Body() updateTaskStatusDto: UpdateStatusDto,
  ): Task {
    return this.tasksService.updateStatusByTaskId(id, updateTaskStatusDto);
  }

  @Delete('/:id')
  removeTaskById(@Param('id') id: string) {
    return this.tasksService.removeTaskById(id);
  }
}
