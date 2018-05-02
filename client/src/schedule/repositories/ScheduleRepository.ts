import { ScheduleModel } from '../models/ScheduleModel';

export interface ScheduleRepository {
  findAll(): Promise<ScheduleModel[]>;
}
