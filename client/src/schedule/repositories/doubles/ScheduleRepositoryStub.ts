import { ScheduleRepository } from '../ScheduleRepository';
import { ScheduleModel, ScheduleType } from '../../models/ScheduleModel';

export class ScheduleRepositoryStub implements ScheduleRepository {
  findAll(): Promise<ScheduleModel[]> {
    return Promise.resolve(
      [
        new ScheduleModel(1, ScheduleType.NoSchedule),
        new ScheduleModel(2, ScheduleType.BackHalf),
        new ScheduleModel(3, ScheduleType.FrontHalf),
        new ScheduleModel(4, ScheduleType.MondayToFriday),
      ]
    );
  }
}
