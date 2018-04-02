import { CrewStore } from './CrewStore';
import { CrewModelFactory } from '../factories/CrewModelFactory';
import { CrewModel } from '../models/CrewModel';
import { DoubleRepositories } from '../../Repositories';
import { ProfileSitePickerStore } from '../../profile/stores/ProfileSitePickerStore';
import { CrewPositionModel } from '../models/CrewPositionModel';
import { CrewRepositorySpy } from '../repositories/doubles/CrewRepositorySpy';

describe('CrewStore', () => {
  let crew: CrewModel;
  let subject: CrewStore;
  let crewPositions: CrewPositionModel[];
  let profileStore: ProfileSitePickerStore;

  beforeEach(async () => {
    DoubleRepositories.crewRepository = new CrewRepositorySpy();
    crew = CrewModelFactory.build();

    profileStore = new ProfileSitePickerStore(DoubleRepositories);
    await profileStore.hydrate();

    subject = new CrewStore(DoubleRepositories, profileStore);
    await subject.hydrate(crew.id);

    crew.crewPositions[0].title = 'Title1';
    crew.crewPositions[0].critical = true;
    crewPositions = subject.crew!.crewPositions;
  });

  it('retrieves a crew by ID', async () => {
    expect(subject.crew).toEqual(crew);
  });

  it('sets the position attributes on a crew', () => {
    const expectedTitle = 'chimichanga';
    subject.setCrewEntry(1, {title: expectedTitle});
    subject.setCrewEntry(1, {critical: true});
    if (subject.crew) {
      const crewPosition = subject.crew.crewPositions.find(position => position.id === 1)!;
      expect(crewPosition.title).toBe(expectedTitle);
      expect(crewPosition.critical).toBeTruthy();
    }
  });

  it('should set loading until hydrate completes', async () => {
    subject = new CrewStore(DoubleRepositories, profileStore);

    subject.setLoading(true);

    await subject.hydrate(crew.id);

    expect(subject.loading).toBeFalsy();
  });

  it('has a list of airmen belonging to the users site', () => {
    expect(subject.airmen.length).toBe(10);
  });

  it('should set a new crew member', () => {
    subject.setNewEntry({airmanName: 'pizza face'});
    expect(subject.newEntry.airmanName).toBe('pizza face');
  });

  it('should save the new crew member set in newEntry', async () => {
    const randomAirman = subject.airmen[1];
    subject.setNewEntry({airmanName: `${randomAirman.lastName}, ${randomAirman.firstName}`});
    await subject.save();
    const [lastCrewPosition] = crewPositions.slice(-1);

    expect(lastCrewPosition.airman.firstName).toBe(randomAirman.firstName);
    expect(lastCrewPosition.airman.lastName).toBe(randomAirman.lastName);
  });

  it('should have a list of airmen options related to the users site', () => {
    const filteredAirmen = subject.airmen.filter(airman => airman.siteId === 1);

    expect(subject.airmenOptions.length).toEqual(filteredAirmen.length);
    subject.airmenOptions.map((airmanOption, index) =>
      expect(airmanOption.label).toBe(`${filteredAirmen[index].lastName}, ${filteredAirmen[index].firstName}`));
  });

  it('should clear an airman, title, and critical by id', () => {
    const crewPosition = crewPositions[0];
    subject.clearPosition(crewPosition.id!);
    expect(crewPositions.length).toBe(1);
  });

  it('should delete positions and save new positions when updating', async () => {
    DoubleRepositories.crewPositionRepository.delete = jest.fn();
    const deletePositions = [crewPositions[0], crewPositions[1]];
    subject.clearPosition(1);
    subject.clearPosition(2);
    await subject.save();
    expect(DoubleRepositories.crewPositionRepository.delete).toHaveBeenCalledWith(deletePositions);
    expect(crewPositions.length).toBe(0);
  });
});