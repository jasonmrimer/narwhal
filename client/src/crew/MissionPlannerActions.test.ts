import { MissionPlannerActions } from './MissionPlannerActions';
import { MissionPlannerStore } from './stores/MissionPlannerStore';
import { DoubleRepositories } from '../utils/Repositories';
import { LocationFilterStore } from '../widgets/stores/LocationFilterStore';
import { CrewStore } from './stores/CrewStore';

describe('MissionPlannerActions', () => {
  let subject: MissionPlannerActions;
  let missionPlannerStore: MissionPlannerStore;
  let locationFilterStore: LocationFilterStore;
  let crewStore: CrewStore;

  beforeEach(() => {
    missionPlannerStore = new MissionPlannerStore(DoubleRepositories);
    locationFilterStore = new LocationFilterStore();
    crewStore = new CrewStore(DoubleRepositories);

    missionPlannerStore.refreshAllAirmen = jest.fn();
    missionPlannerStore.refreshAllEvents = jest.fn();
    locationFilterStore.setSelectedSite(1);
    crewStore.save = jest.fn();

    subject = new MissionPlannerActions({missionPlannerStore, locationFilterStore, crewStore});
  });

  it('should call refreshAllAirmen', async () => {
    await subject.refreshAirman();
    expect(missionPlannerStore.refreshAllAirmen).toHaveBeenCalledWith(1);
  });

  it('should call submit', async () => {
    await subject.submit();
    expect(crewStore.save).toHaveBeenCalled();
    expect(missionPlannerStore.refreshAllEvents).toHaveBeenCalledWith(1);
  });
});