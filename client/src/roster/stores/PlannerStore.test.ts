import * as moment from 'moment';
import { TimeServiceStub } from '../../tracker/services/doubles/TimeServiceStub';
import { PlannerStore } from './PlannerStore';
import { AirmanModelFactory } from '../../airman/factories/AirmanModelFactory';
import { ScheduleModel } from '../../schedule/models/ScheduleModel';
import { AirmanScheduleModel } from '../../airman/models/AirmanScheduleModel';

describe('PlannerStore', () => {
  let subject: PlannerStore;

  beforeEach(async () => {
    subject = new PlannerStore(new TimeServiceStub());
  });

  it('will increment the planner week and change the side panel week', () => {
    expect(subject.plannerWeek[0].isSame(moment('2017-11-26'))).toBeTruthy();
    subject.incrementPlannerWeek();
    expect(subject.plannerWeek[0].isSame(moment('2017-12-03'))).toBeTruthy();
    expect(subject.sidePanelWeek[0].isSame(moment('2017-12-03'))).toBeTruthy();
  });

  it('will increment the side panel week but not change the planner week', () => {
    expect(subject.plannerWeek[0].isSame(moment('2017-11-26'))).toBeTruthy();
    subject.incrementSidePanelWeek();
    expect(subject.plannerWeek[0].isSame(moment('2017-11-26'))).toBeTruthy();
    expect(subject.sidePanelWeek[0].isSame(moment('2017-12-03'))).toBeTruthy();
  });

  it('will decrement the planner week', () => {
    expect(subject.plannerWeek[0].isSame(moment('2017-11-26'))).toBeTruthy();
    subject.decrementPlannerWeek();
    expect(subject.plannerWeek[0].isSame(moment('2017-11-19'))).toBeTruthy();
  });

  it('should navigate to the given week', () => {
    subject.navigateToWeek(moment('2018-04-17'));
    expect(subject.sidePanelWeek[0].isSame(moment('2018-04-15'))).toBeTruthy();
  });

  it('should determine availability for an Airman on a day', () => {
    let airman = AirmanModelFactory.build();
    const backHalf = new ScheduleModel(1, 'Back Half', false, false, false, true, true, true, true);
    const mondayFriday = new ScheduleModel(1, 'M-F', false, true, true, true, true, true, false);
    const pastSchedule = new AirmanScheduleModel(
      1,
      airman.id,
      backHalf,
      moment('2017-11-26').subtract(3, 'months'),
      moment('2017-11-26').subtract(1, 'day')
    );
    const currentSchedule = new AirmanScheduleModel(
      1,
      airman.id,
      mondayFriday,
      moment('2017-11-26'),
      null
    );
    airman.schedules = [pastSchedule, currentSchedule];

    expect(subject.isAvailableToWork(airman, moment('2017-11-20'))).toBeFalsy();
    expect(subject.isAvailableToWork(airman, moment('2017-11-24'))).toBeTruthy();
    expect(subject.isAvailableToWork(airman, moment('2017-11-27'))).toBeTruthy();
    expect(subject.isAvailableToWork(airman, moment('2017-12-02'))).toBeFalsy();
  });
});