import { TaskStatus } from '../task.model';
import { IsEnum } from 'class-validator';

export class UpdateStatusDto {
  @IsEnum(TaskStatus)
  status: TaskStatus;
}
