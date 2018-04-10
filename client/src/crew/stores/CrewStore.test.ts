import { CrewStore } from './CrewStore';
import { CrewModelFactory } from '../factories/CrewModelFactory';
import { CrewModel } from '../models/CrewModel';
import { DoubleRepositories } from '../../utils/Repositories';
import { CrewPositionModel } from '../models/CrewPositionModel';
import { CrewRepositorySpy } from '../repositories/doubles/CrewRepositorySpy';
import { AirmanModel } from '../../airman/models/AirmanModel';

describe('CrewStore', () => {
  let crew: CrewModel;
  let subject: CrewStore;
  let crewPositions: CrewPositionModel[];
  let airmen: AirmanModel[];

  beforeEach(async () => {
    DoubleRepositories.crewRepository = new CrewRepositorySpy();
    crew = CrewModelFactory.build();

    subject = new CrewStore(DoubleRepositories);

    airmen = await DoubleRepositories.airmanRepository.findBySiteId(14);
    await subject.hydrate(crew, airmen);

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

  it('should set a new crew member', () => {
    subject.setNewEntry({airmanName: 'pizza face'});
    expect(subject.newEntry.airmanName).toBe('pizza face');
  });

  it('should save the new crew member set in newEntry', async () => {
    const airmanDisplayName = subject.airmenOptions[1].label;
    subject.setNewEntry({airmanName: `${airmanDisplayName}`});
    await subject.save();
    const [lastCrewPosition] = crewPositions.slice(-1);

    expect(lastCrewPosition.airman.firstName).toBe(airmanDisplayName.split(', ', 2)[1]);
    expect(lastCrewPosition.airman.lastName).toBe(airmanDisplayName.split(', ', 2)[0]);
  });

  it('should have a list of airmen options related to the users site', () => {
    expect(subject.airmenOptions.length).toEqual(airmen.length);
    subject.airmenOptions.map((airmanOption, index) =>
      expect(airmanOption.label).toBe(`${airmen[index].lastName}, ${airmen[index].firstName}`));
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