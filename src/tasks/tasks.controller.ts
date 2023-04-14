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
import { Task } from './task.entity';
import { CreateTaskDto } from './dtos/create-task.dto';
import { UpdateTaskDto } from './dtos/update-task.dto';
import { GetTaskFilterDto } from './dtos/get-tasks-filter.dto';
import { UpdateStatusDto } from './dtos/update-status.dto';

@Controller('tasks')
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Post('/')
  createTask(@Body() body: CreateTaskDto): Promise<Task> {
    return this.tasksService.createTask(body);
  }

  @Get('/')
  getTasks(@Query() filterDto: GetTaskFilterDto): Promise<Task[]> {
    return this.tasksService.getTasks(filterDto);
  }

  @Get('/:id')
  getTaskById(@Param('id') id: string): Promise<Task> {
    return this.tasksService.getTaskById(id);
  }

  @Patch('/:id/status')
  updateTaskStatusById(
    @Param('id') id: string,
    @Body() body: UpdateStatusDto,
  ): Promise<Task> {
    return this.tasksService.updateTaskStatusById(id, body.status);
  }

  @Delete('/:id')
  deleteTaskById(@Param('id') id: string): Promise<void> {
    return this.tasksService.deleteTaskById(id);
  }

  //   return this.tasksService.getAllTasks();
  // }

  // @Post('/')
  // createTask(@Body() body: CreateTaskDto): Task {
  //   return this.tasksService.createTask(body);
  // }

  // @Patch('/:id')
  // updateTaskById(@Param('id') id: string, @Body() body: UpdateTaskDto): Task {
  //   return this.tasksService.updateTaskById(id, body);
  // }

  // @Patch('/:id/status')
  // updateStatusByTaskId(
  //   @Param('id') id: string,
  //   @Body() updateTaskStatusDto: UpdateStatusDto,
  // ): Task {
  //   return this.tasksService.updateStatusByTaskId(id, updateTaskStatusDto);
  // }

  // @Delete('/:id')
  // removeTaskById(@Param('id') id: string) {
  //   return this.tasksService.removeTaskById(id);
  // }
}
