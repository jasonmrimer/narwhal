import * as moment from 'moment';
import { TimeServiceStub } from '../../tracker/services/doubles/TimeServiceStub';
import { PlannerStore } from './PlannerStore';

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
    subject.navigateToSidePanelWeek(moment('2018-04-17'));
    expect(subject.sidePanelWeek[0].isSame(moment('2018-04-15'))).toBeTruthy();
  });
});