import {
  UseGuards,
  Controller,
  Body,
  Param,
  Query,
  Get,
  Post,
  Patch,
  Delete,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TasksService } from './tasks.service';
import { Task } from './task.entity';
import { CreateTaskDto } from './dtos/create-task.dto';
import { GetTaskFilterDto } from './dtos/get-tasks-filter.dto';
import { UpdateStatusDto } from './dtos/update-status.dto';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/auth/user.entity';

@UseGuards(AuthGuard())
@Controller('tasks')
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Post('/')
  createTask(
    @GetUser() user: User,
    @Body() body: CreateTaskDto,
  ): Promise<Task> {
    return this.tasksService.createTask(user, body);
  }

  @Get('/')
  getTasks(
    @GetUser() user: User,
    @Query() filterDto: GetTaskFilterDto,
  ): Promise<Task[]> {
    return this.tasksService.getTasks(user, filterDto);
  }

  @Get('/:id')
  getTaskById(@GetUser() user: User, @Param('id') id: string): Promise<Task> {
    return this.tasksService.getTaskById(user, id);
  }

  @Patch('/:id/status')
  updateTaskStatusById(
    @GetUser() user: User,
    @Param('id') id: string,
    @Body() body: UpdateStatusDto,
  ): Promise<Task> {
    return this.tasksService.updateTaskStatusById(user, id, body.status);
  }

  @Delete('/:id')
  deleteTaskById(
    @GetUser() user: User,
    @Param('id') id: string,
  ): Promise<void> {
    return this.tasksService.deleteTaskById(user, id);
  }
}
