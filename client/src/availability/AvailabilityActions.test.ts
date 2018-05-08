import { AvailabilityActions } from './AvailabilityActions';
import { PlannerStore } from '../roster/stores/PlannerStore';
import { AvailabilityStore } from './stores/AvailabilityStore';
import { TrackerStore } from '../tracker/stores/TrackerStore';
import { AirmanModelFactory } from '../airman/factories/AirmanModelFactory';

describe('AvailabilityActions', () => {
  const airman = AirmanModelFactory.build();
  const sidePanelWeek = Symbol('sidePanelWeek');
  let plannerStore: Partial<PlannerStore>;
  let availabilityStore: Partial<AvailabilityStore>;
  let trackerStore: Partial<TrackerStore>;
  let subject: AvailabilityActions;

  beforeEach(() => {
    plannerStore = {
      incrementSidePanelWeek: jest.fn(),
      decrementSidePanelWeek: jest.fn(),
      sidePanelWeek: (sidePanelWeek as any)
    };

    availabilityStore = {
      refreshAirmanEvents: jest.fn(),
      setSelectedDate: jest.fn(),
      clearSelectedDate: jest.fn(),
      showEventForm: jest.fn()
    };

    trackerStore = {
      selectedAirman: airman
    };

    const stores = {
      plannerStore,
      availabilityStore,
      trackerStore
    } as any;
    subject = new AvailabilityActions(stores);
  });

  it('should increment the side panel week', async () => {
    await subject.incrementWeek();
    expect(plannerStore.incrementSidePanelWeek).toHaveBeenCalled();
    expect(availabilityStore.refreshAirmanEvents).toHaveBeenCalledWith(airman.id, sidePanelWeek);
  });

  it('should decrement the side panel week', async () => {
    await subject.decrementWeek();
    expect(plannerStore.decrementSidePanelWeek).toHaveBeenCalled();
    expect(availabilityStore.refreshAirmanEvents).toHaveBeenCalledWith(airman.id, sidePanelWeek);
  });

  it('should open the event form', () => {
    subject.openEventForm();
    expect(availabilityStore.clearSelectedDate).toHaveBeenCalled();
    expect(availabilityStore.showEventForm).toHaveBeenCalled();
  });

  it('should open the event form for a day', () => {
    const day = Symbol('day');
    subject.openEventFormForDay((day as any));
    expect(availabilityStore.setSelectedDate).toHaveBeenCalledWith(day);
    expect(availabilityStore.showEventForm).toHaveBeenCalled();
  });
});