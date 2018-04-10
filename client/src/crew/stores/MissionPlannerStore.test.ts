import { MissionPlannerStore } from './MissionPlannerStore';
import { DoubleRepositories } from '../../utils/Repositories';
import { ProfileSitePickerStore } from '../../profile/stores/ProfileSitePickerStore';
import { EventModel, EventType } from '../../event/models/EventModel';
import { AirmanModel } from '../../airman/models/AirmanModel';

describe('MissionPlannerStore', () => {
  let airmen: AirmanModel[];
  let subject: MissionPlannerStore;

  beforeEach(async () => {
    const profileStore = new ProfileSitePickerStore(DoubleRepositories);
    await profileStore.hydrate();

    const crew = await DoubleRepositories.crewRepository.findOne(1);
    airmen = await DoubleRepositories.airmanRepository.findBySiteId(14);

    await DoubleRepositories.eventRepository.save(
      new EventModel(
        'A',
        'A',
        crew.mission.startDateTime.clone().add(1, 'hour'),
        crew.mission.startDateTime.clone().add(2, 'hour'),
        airmen[8].id,
        EventType.Appointment
      )
    );

    await DoubleRepositories.eventRepository.save(
      new EventModel(
        'B',
        'B',
        crew.mission.startDateTime.clone().add(2, 'hour'),
        crew.mission.startDateTime.clone().add(5, 'hour'),
        airmen[9].id,
        EventType.Appointment
      )
    );

    subject = new MissionPlannerStore(DoubleRepositories, profileStore);
    subject.locationFilterStore.hydrate = jest.fn();
    subject.rosterHeaderStore.hydrate = jest.fn();
    subject.crewStore.hydrate = jest.fn();

    await subject.hydrate(1);
  });

  describe('hydrating', () => {
    it('should set loading while hydrating', async () => {
      subject.setLoading(true);
      await subject.hydrate(1);
      expect(subject.loading).toBeFalsy();
    });

    it('should call LocationFilterStores hydrate', async () => {
      expect(subject.locationFilterStore.hydrate).toBeCalledWith(
        14,
        await DoubleRepositories.siteRepository.findAll()
      );
    });

    it('should call RosterHeaderStores hydrate', async () => {
      expect(subject.rosterHeaderStore.hydrate).toBeCalledWith(
        await DoubleRepositories.skillRepository.findAllCertifications(),
        await DoubleRepositories.skillRepository.findAllQualifications()
      );
    });

    it('should call CrewStores hydrate', async () => {
      expect(subject.crewStore.hydrate).toBeCalledWith(
        await DoubleRepositories.crewRepository.findOne(1),
        await DoubleRepositories.airmanRepository.findBySiteId(14)
      );
    });
  });

  it('should return available airmen', () => {
    expect(subject.availableAirmen.length).toEqual(8);
    const airmenIds = subject.availableAirmen.map(airman => airman.id);
    expect(airmenIds.includes(airmen[8].id)).toBeFalsy();
    expect(airmenIds.includes(airmen[9].id)).toBeFalsy();
  });

  it('should return unavailable airmen', () => {
    expect(subject.unavailableAirmen.length).toEqual(2);
    const airmenIds = subject.unavailableAirmen.map(airman => airman.id);
    expect(airmenIds.includes(airmen[8].id)).toBeTruthy();
    expect(airmenIds.includes(airmen[9].id)).toBeTruthy();
  });

  it('should return available airmen with filters applied', () => {
    const qualification = subject.availableAirmen[0].qualifications[0].qualification;
    subject.rosterHeaderStore.setSelectedQualificationOptions(
      [{value: qualification.id, label: qualification.acronym}]
    );

    expect(subject.availableAirmen.length).toBe(3);
  });

  it('should return available airmen with filters applied', () => {
    const qualification = subject.unavailableAirmen[1].qualifications[1].qualification;
    subject.rosterHeaderStore.setSelectedQualificationOptions(
      [{value: qualification.id, label: qualification.acronym}]
    );

    expect(subject.unavailableAirmen.length).toBe(1);
  });
});
