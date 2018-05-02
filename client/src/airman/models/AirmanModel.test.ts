import { ScheduleModel, ScheduleType } from '../../schedule/models/ScheduleModel';
import { AirmanScheduleModel } from './AirmanScheduleModel';
import { AirmanModelFactory } from '../factories/AirmanModelFactory';
import * as moment from 'moment';
import { AirmanModel } from './AirmanModel';

describe('AirmanModel', () => {
  const backHalf = new ScheduleModel(1, ScheduleType.BackHalf, false, false, false, true, true, true, true);
  const mondayFriday = new ScheduleModel(1, ScheduleType.MondayToFriday, false, true, true, true, true, true, false);
  let currentSchedule: AirmanScheduleModel;
  let subject: AirmanModel;

  beforeEach(() => {
    subject = AirmanModelFactory.build();

    const pastSchedule = new AirmanScheduleModel(
      subject.id,
      backHalf,
      moment('2017-11-26').subtract(3, 'months'),
      moment('2017-11-26').subtract(1, 'day')
    );

    currentSchedule = new AirmanScheduleModel(
      subject.id,
      mondayFriday,
      moment('2017-11-26'),
      null
    );

    subject.schedules = [pastSchedule, currentSchedule];
  });

  it('should determine availability for an Airman on a day', () => {
    expect(subject.isAvailableForWork(moment('2017-11-20'))).toBeFalsy();
    expect(subject.isAvailableForWork(moment('2017-11-24'))).toBeTruthy();
    expect(subject.isAvailableForWork(moment('2017-11-27'))).toBeTruthy();
    expect(subject.isAvailableForWork(moment('2017-12-02'))).toBeFalsy();
  });

  it('should return the schedule for today', () => {
    expect(subject.currentScheduleId).toBe(1);
  });
});