import { Injectable } from '@nestjs/common';
import { Repository, DataSource } from 'typeorm';
import { Task } from './task.entity';

@Injectable()
export class TasksRepository extends Repository<Task> {
  constructor(private dataSource: DataSource) {
    super(Task, dataSource.createEntityManager());
  }
}
