import { CrewStore } from './CrewStore';
import { CrewModelFactory } from '../factories/CrewModelFactory';
import { CrewModel } from '../models/CrewModel';
import { DoubleRepositories } from '../../Repositories';

describe('CrewStore', () => {
  let crew: CrewModel;
  let subject: CrewStore;

  beforeEach(async () => {
    crew = CrewModelFactory.build();
    subject = new CrewStore(DoubleRepositories);
    await subject.hydrate(crew.id);

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

  it('has a list of all the airman', () => {
    expect(subject.airmen.length).toBe(12);
  });

  it('should set a new crew member', () => {
    subject.setNewEntry({airmanName: 'pizza face'});
    expect(subject.newEntry.airmanName).toBe('pizza face');
  });

  it('should save the new crew member set in newEntry', () => {
    const randomAirman = subject.airmen[1];
    subject.setNewEntry({airmanName: `${randomAirman.lastName}, ${randomAirman.firstName}`});
    subject.save();
    const [lastCrewPosition] = subject.crew!.crewPositions.slice(-1);

    expect(lastCrewPosition.airman.firstName).toBe(randomAirman.firstName);
    expect(lastCrewPosition.airman.lastName).toBe(randomAirman.lastName);
  });
});