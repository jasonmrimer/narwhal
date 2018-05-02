import { ScheduleModel, ScheduleType } from '../../schedule/models/ScheduleModel';
import { AirmanScheduleModel } from './AirmanScheduleModel';
import { AirmanModelFactory } from '../factories/AirmanModelFactory';
import * as moment from 'moment';

describe('AirmanModel', () => {

  it('should return the schedule for today', () => {
    const subject = AirmanModelFactory.build();
    const backHalf = new ScheduleModel(1, ScheduleType.BackHalf, false, false, false, true, true, true, true);
    const mondayFriday = new ScheduleModel(1, ScheduleType.MondayToFriday, false, true, true, true, true, true, false);

    const pastSchedule = new AirmanScheduleModel(
      subject.id,
      backHalf,
      moment('2017-11-26').subtract(3, 'months'),
      moment('2017-11-26').subtract(1, 'day')
    );

    const currentSchedule = new AirmanScheduleModel(
      subject.id,
      mondayFriday,
      moment('2017-11-26'),
      null
    );

    subject.schedules = [pastSchedule, currentSchedule];

    expect(subject.currentScheduleId).toBe(1);
  });
});