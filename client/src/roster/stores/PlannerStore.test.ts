import * as moment from 'moment';
import {TimeServiceStub} from '../../tracker/services/doubles/TimeServiceStub';
import {PlannerStore} from './PlannerStore';

describe('PlannerStore', () => {
  let subject: PlannerStore;

  beforeEach(async () => {
    subject = new PlannerStore(new TimeServiceStub());
  });

  it('will increment the planner week and should not change the side panel week', () => {
    expect(subject.plannerWeek[0].isSame(moment('2017-11-26'))).toBeTruthy();
    subject.incrementPlannerWeek();
    expect(subject.plannerWeek[0].isSame(moment('2017-11-27'))).toBeTruthy();
    expect(subject.sidePanelWeek[0].isSame(moment('2017-11-26'))).toBeTruthy();
  });

  it('will increment the side panel week but not change the planner week', () => {
    expect(subject.plannerWeek[0].isSame(moment('2017-11-26'))).toBeTruthy();
    subject.incrementSidePanelWeek();
    expect(subject.plannerWeek[0].isSame(moment('2017-11-26'))).toBeTruthy();
    expect(subject.sidePanelWeek[0].isSame(moment('2017-12-03'))).toBeTruthy();
  });

  it('will decrement the planner by a day', () => {
    expect(subject.plannerWeek[0].isSame(moment('2017-11-26'))).toBeTruthy();
    subject.decrementPlannerWeek();
    expect(subject.plannerWeek[0].isSame(moment('2017-11-25'))).toBeTruthy();
  });

  it('should navigate to the given week', () => {
    subject.navigateToSidePanelWeek(moment('2018-04-17'));
    expect(subject.sidePanelWeek[0].isSame(moment('2018-04-15'))).toBeTruthy();
  });

  it('should increment the planner week by one day', () => {
    expect(subject.plannerWeek[0].isSame(moment('2017-11-26'))).toBeTruthy();
    subject.incrementPlannerWeek();
    expect(subject.plannerWeek[0].isSame(moment('2017-11-27'))).toBeTruthy();
  });

  it('should return a time span of 14 days', () => {
    expect(subject.plannerTimeSpan.length).toBe(14);
    expect(subject.plannerTimeSpan[0].isSame(moment('2017-11-26'))).toBeTruthy();
    expect(subject.plannerTimeSpan[13].isSame(moment('2017-12-09').endOf('day'))).toBeTruthy();
  });

  it('should increment time span by one day', () => {
    expect(subject.plannerTimeSpan[0].isSame(moment('2017-11-26'))).toBeTruthy();
    expect(subject.plannerTimeSpan[13].isSame(moment('2017-12-09').endOf('day'))).toBeTruthy();
    subject.incrementPlannerTimeSpan();
    expect(subject.plannerTimeSpan[0].isSame(moment('2017-11-27'))).toBeTruthy();
    expect(subject.plannerTimeSpan[13].isSame(moment('2017-12-10').endOf('day'))).toBeTruthy();
  });

  it('should decrement time span by one day', () => {
    expect(subject.plannerTimeSpan[0].isSame(moment('2017-11-26'))).toBeTruthy();
    expect(subject.plannerTimeSpan[13].isSame(moment('2017-12-09').endOf('day'))).toBeTruthy();
    subject.decrementPlannerTimeSpan();
    expect(subject.plannerTimeSpan[0].isSame(moment('2017-11-25'))).toBeTruthy();
    expect(subject.plannerTimeSpan[13].isSame(moment('2017-12-08').endOf('day'))).toBeTruthy();
  });
});