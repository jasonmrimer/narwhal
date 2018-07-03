import { CrewStore } from './CrewStore';
import { CrewModelFactory } from '../factories/CrewModelFactory';
import { CrewModel } from '../models/CrewModel';
import { DoubleRepositories } from '../../utils/Repositories';
import { CrewPositionModel } from '../models/CrewPositionModel';
import { CrewRepositorySpy } from '../repositories/doubles/CrewRepositorySpy';
import { AirmanModel } from '../../airman/models/AirmanModel';

describe('CrewStore', () => {
  let crew: CrewModel;
  let crewPositions: CrewPositionModel[];
  let airmen: AirmanModel[];
  let subject: CrewStore;

  beforeEach(async () => {
    DoubleRepositories.crewRepository = new CrewRepositorySpy();
    crew = CrewModelFactory.build();

    subject = new CrewStore(DoubleRepositories);

    airmen = await DoubleRepositories.airmanRepository.findBySiteId(14);
    subject.hydrate(crew, airmen);

    crew.crewPositions[0].title = 'Title1';
    crew.crewPositions[0].critical = true;
    crewPositions = subject.crew!.crewPositions;
  });

  it('retrieves a crew by ID', async () => {
    expect(subject.crew).toEqual(crew);
  });

  it('sets the position attributes on a crew', () => {
    const expectedTitle = 'chimichanga';
    const expectedRemarks = 'XFORCE!';
    subject.setCrewEntry(1, {title: expectedTitle});
    subject.setCrewEntry(1, {critical: true});
    subject.setCrewEntry(1, {remarks: expectedRemarks});
    if (subject.crew) {
      const crewPosition = subject.crew.crewPositions.find(position => position.id === 1)!;
      expect(crewPosition.title).toBe(expectedTitle);
      expect(crewPosition.critical).toBeTruthy();
      expect(crewPosition.remarks).toBe(expectedRemarks);
    }
  });

  it('should set a new crew member', () => {
    subject.setNewEntry({airmanName: 'pizza face'});
    expect(subject.newEntry.airmanName).toBe('pizza face');
  });

  it('should clear an airman, title, and critical by id', () => {
    const crewPosition = crewPositions[0];
    subject.clearPosition(crewPosition.id!);
    expect(crewPositions.length).toBe(1);
  });

  it('should setPendingDelete positions and save new positions when updating', async () => {
    DoubleRepositories.crewPositionRepository.delete = jest.fn();
    const deletePositions = [crewPositions[0], crewPositions[1]];
    subject.clearPosition(1);
    subject.clearPosition(2);

    await subject.save();

    expect(DoubleRepositories.crewPositionRepository.delete).toHaveBeenCalledWith(deletePositions);
    expect(crewPositions.length).toBe(0);
  });
});