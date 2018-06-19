import { ScheduleModel, ScheduleType } from '../../schedule/models/ScheduleModel';
import * as moment from 'moment';

describe('ScheduleModel', () => {
  let subject: ScheduleModel;

  it('should return if given day is on or off for non panama', () => {
    subject = new ScheduleModel(1, ScheduleType.MondayToFriday, false, true, true, true, true, true, false);
    expect(subject.isScheduledWorkDay(moment('2018-05-02T11:55:12-04:00').day('Sunday'))).toBeFalsy();
    expect(subject.isScheduledWorkDay(moment('2018-05-02T11:55:12-04:00').day('Monday'))).toBeTruthy();
  });

  it('should return if given day is on or off for panama a', () => {
    subject = new ScheduleModel(1, ScheduleType.PanamaA, false, true, true, false, false, true, true);

    expect(subject.isScheduledWorkDay(moment('2018-05-02T11:55:12-04:00').day('Sunday'))).toBeFalsy();
    expect(subject.isScheduledWorkDay(moment('2018-05-02T11:55:12-04:00').day('Monday'))).toBeTruthy();
    expect(subject.isScheduledWorkDay(moment('2018-05-02T11:55:12-04:00').day('Tuesday'))).toBeTruthy();
    expect(subject.isScheduledWorkDay(moment('2018-05-02T11:55:12-04:00').day('Wednesday'))).toBeFalsy();
    expect(subject.isScheduledWorkDay(moment('2018-05-02T11:55:12-04:00').day('Thursday'))).toBeFalsy();
    expect(subject.isScheduledWorkDay(moment('2018-05-02T11:55:12-04:00').day('Friday'))).toBeTruthy();
    expect(subject.isScheduledWorkDay(moment('2018-05-02T11:55:12-04:00').day('Saturday'))).toBeTruthy();

    expect(subject.isScheduledWorkDay(moment('2018-05-09T11:55:12-04:00').day('Sunday'))).toBeTruthy();
    expect(subject.isScheduledWorkDay(moment('2018-05-09T11:55:12-04:00').day('Monday'))).toBeFalsy();
    expect(subject.isScheduledWorkDay(moment('2018-05-09T11:55:12-04:00').day('Tuesday'))).toBeFalsy();
    expect(subject.isScheduledWorkDay(moment('2018-05-09T11:55:12-04:00').day('Wednesday'))).toBeTruthy();
    expect(subject.isScheduledWorkDay(moment('2018-05-09T11:55:12-04:00').day('Thursday'))).toBeTruthy();
    expect(subject.isScheduledWorkDay(moment('2018-05-09T11:55:12-04:00').day('Friday'))).toBeFalsy();
    expect(subject.isScheduledWorkDay(moment('2018-05-09T11:55:12-04:00').day('Saturday'))).toBeFalsy();
  });

  it('should return if given day is on or off for panama b', () => {
    subject = new ScheduleModel(1, ScheduleType.PanamaB, true, false, false, true, true, false, false);

    expect(subject.isScheduledWorkDay(moment('2018-05-02T11:55:12-04:00').day('Sunday'))).toBeTruthy();
    expect(subject.isScheduledWorkDay(moment('2018-05-02T11:55:12-04:00').day('Monday'))).toBeFalsy();
    expect(subject.isScheduledWorkDay(moment('2018-05-02T11:55:12-04:00').day('Tuesday'))).toBeFalsy();
    expect(subject.isScheduledWorkDay(moment('2018-05-02T11:55:12-04:00').day('Wednesday'))).toBeTruthy();
    expect(subject.isScheduledWorkDay(moment('2018-05-02T11:55:12-04:00').day('Thursday'))).toBeTruthy();
    expect(subject.isScheduledWorkDay(moment('2018-05-02T11:55:12-04:00').day('Friday'))).toBeFalsy();
    expect(subject.isScheduledWorkDay(moment('2018-05-02T11:55:12-04:00').day('Saturday'))).toBeFalsy();

    expect(subject.isScheduledWorkDay(moment('2018-05-09T11:55:12-04:00').day('Sunday'))).toBeFalsy();
    expect(subject.isScheduledWorkDay(moment('2018-05-09T11:55:12-04:00').day('Monday'))).toBeTruthy();
    expect(subject.isScheduledWorkDay(moment('2018-05-09T11:55:12-04:00').day('Tuesday'))).toBeTruthy();
    expect(subject.isScheduledWorkDay(moment('2018-05-09T11:55:12-04:00').day('Wednesday'))).toBeFalsy();
    expect(subject.isScheduledWorkDay(moment('2018-05-09T11:55:12-04:00').day('Thursday'))).toBeFalsy();
    expect(subject.isScheduledWorkDay(moment('2018-05-09T11:55:12-04:00').day('Friday'))).toBeTruthy();
    expect(subject.isScheduledWorkDay(moment('2018-05-09T11:55:12-04:00').day('Saturday'))).toBeTruthy();
  });
});
