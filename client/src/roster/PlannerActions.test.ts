import { PlannerActions } from './PlannerActions';

describe('PlannerActions', () => {
  let subject: PlannerActions;
  let refreshEventsSpy: jest.Mock;
  let incrementPlannerTimeSpanSpy: jest.Mock;
  let refreshAirmanEventsSpy: jest.Mock;
  let decrementPlannerTimeSpanSpy: jest.Mock;
  let plannerStore: any;
  const week = Symbol('week');
  const timeSpan = Symbol('timeSpan');
  const airman = {id: 1, isEmpty: false};

  beforeEach(() => {
    refreshEventsSpy = jest.fn();
    refreshAirmanEventsSpy = jest.fn();
    incrementPlannerTimeSpanSpy = jest.fn();
    decrementPlannerTimeSpanSpy = jest.fn();

    const trackerStore = {
      refreshEvents: refreshEventsSpy,
      selectedAirman: airman,performLoading: (fn: any) => {
        fn();
      },
    };

    const availabilityStore = {
      refreshAirmanEvents: refreshAirmanEventsSpy
    };

    plannerStore = {
      incrementPlannerTimeSpan: incrementPlannerTimeSpanSpy,
      decrementPlannerTimeSpan: decrementPlannerTimeSpanSpy,
      plannerWeek: week,
      plannerTimeSpan: timeSpan,
      sidePanelWeek: week
    };

    subject = new PlannerActions(({trackerStore, availabilityStore, plannerStore} as any));
  });

  it('should increment the time span by a day', async () => {
    await subject.incrementDay();
    expect(plannerStore.incrementPlannerTimeSpan).toHaveBeenCalled();
    expect(refreshEventsSpy).toHaveBeenCalledWith(plannerStore.plannerTimeSpan);
    expect(refreshAirmanEventsSpy).toHaveBeenCalledWith(airman.id, plannerStore.sidePanelWeek);
  });

  it('should decrement the time span by a day', async () => {
    await subject.decrementDay();
    expect(plannerStore.decrementPlannerTimeSpan).toHaveBeenCalled();
    expect(refreshEventsSpy).toHaveBeenCalledWith(plannerStore.plannerTimeSpan);
    expect(refreshAirmanEventsSpy).toHaveBeenCalledWith(airman.id, plannerStore.sidePanelWeek);
  });
});