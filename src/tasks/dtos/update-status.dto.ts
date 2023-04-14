import { TaskStatus } from '../task-status.enum';
import { IsEnum } from 'class-validator';

export class UpdateStatusDto {
  @IsEnum(TaskStatus)
  status: TaskStatus;
}
