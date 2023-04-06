import { TaskStatus } from '../task.model';
import { IsEnum, IsString, IsOptional } from 'class-validator';

export class GetTaskFilterDto {
  @IsEnum(TaskStatus)
  @IsOptional()
  status?: TaskStatus;

  @IsString()
  @IsOptional()
  search?: string;
}
