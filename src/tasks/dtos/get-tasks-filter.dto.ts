import { TaskStatus } from '../task-status.enum';
import { IsEnum, IsString, IsOptional } from 'class-validator';

export class GetTaskFilterDto {
  @IsEnum(TaskStatus)
  @IsOptional()
  status?: TaskStatus;

  @IsString()
  @IsOptional()
  search?: string;
}
