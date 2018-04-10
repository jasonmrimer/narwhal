import { MissionPlannerStore } from './MissionPlannerStore';
import { DoubleRepositories } from '../../utils/Repositories';
import { ProfileSitePickerStore } from '../../profile/stores/ProfileSitePickerStore';

describe('MissionPlannerStore', () => {
  let subject: MissionPlannerStore;

  beforeEach(async () => {
    const profileStore = new ProfileSitePickerStore(DoubleRepositories);
    await profileStore.hydrate();

    subject = new MissionPlannerStore(DoubleRepositories, profileStore);
    subject.locationFilterStore.hydrate = jest.fn();
    subject.rosterHeaderStore.hydrate = jest.fn();
    await subject.hydrate(1);
  });

  describe('hydrating', () => {
    it('should set loading while hydrating', async () => {
      subject.setLoading(true);
      await subject.hydrate(1);
      expect(subject.loading).toBeFalsy();
    });

    it('should call LocationFilterStores hydrate', async () => {
      expect(subject.locationFilterStore.hydrate).toBeCalledWith(14, await DoubleRepositories.siteRepository.findAll());
    });

    it('should call RosterHeaderStores hydrate', async () => {
      expect(subject.rosterHeaderStore.hydrate).toBeCalledWith(
        await DoubleRepositories.skillRepository.findAllCertifications(),
        await DoubleRepositories.skillRepository.findAllQualifications()
      );
    });

    it('should call CrewStores hydrate', async () => {
      const crew = await DoubleRepositories.crewRepository.findOne(1);
      await subject.hydrate(crew.id);

      expect(subject.airmen.length).toBe(10);
      expect(subject.crewStore.crew).toEqual(crew);
      expect(subject.crewStore.airmen).toEqual(subject.airmen);
    });
  });

  it('has a list of airmen belonging to the users site', () => {
    expect(subject.airmen.length).toBe(10);
    subject.airmen.map((airman) => expect(airman.siteId).toBe(14));
  });

  it('should have a separate airmen list based on filters', () => {
    const qualification = subject.airmen[0].qualifications[0].qualification;

    subject.rosterHeaderStore.setSelectedQualificationOptions(
      [{value: qualification.id, label: qualification.acronym}]
    );

    expect(subject.filteredAirmen.length).toBe(4);
    expect(subject.airmen.length).toBe(10);
  });
});
