import { PlannerActions } from './PlannerActions';

describe('PlannerActions', () => {
  let subject: PlannerActions;
  let refreshEventsSpy: jest.Mock;
  let incrementPlannerWeek: jest.Mock;
  let refreshAirmanEventsSpy: jest.Mock;
  let decrementPlannerWeek: jest.Mock;
  let plannerStore: any;
  const week = Symbol('week');
  const airman = {id: 1, isEmpty: false};

  beforeEach(() => {
    refreshEventsSpy = jest.fn();
    refreshAirmanEventsSpy = jest.fn();
    incrementPlannerWeek = jest.fn();
    decrementPlannerWeek = jest.fn();

    const trackerStore = {
      refreshEvents: refreshEventsSpy,
      selectedAirman: airman
    };
    const availabilityStore = {refreshAirmanEvents: refreshAirmanEventsSpy};
    plannerStore = {
      incrementPlannerWeek: incrementPlannerWeek,
      decrementPlannerWeek: decrementPlannerWeek,
      plannerWeek: week,
      sidePanelWeek: week
    };

    subject = new PlannerActions({trackerStore, availabilityStore, plannerStore});
  });

  it('should increment the week by a day', async () => {
    await subject.incrementDay();
    expect(plannerStore.incrementPlannerWeek).toHaveBeenCalled();
    expect(refreshEventsSpy).toHaveBeenCalledWith(plannerStore.plannerWeek);
    expect(refreshAirmanEventsSpy).toHaveBeenCalledWith(airman.id, plannerStore.sidePanelWeek);
  });

  it('should decrement the week by a day', async () => {
    await subject.decrementDay();
    expect(plannerStore.decrementPlannerWeek).toHaveBeenCalled();
    expect(refreshEventsSpy).toHaveBeenCalledWith(plannerStore.plannerWeek);
    expect(refreshAirmanEventsSpy).toHaveBeenCalledWith(airman.id, plannerStore.sidePanelWeek);
  });
});