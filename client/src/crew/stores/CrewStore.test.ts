import { CrewStore } from './CrewStore';
import { CrewRepositorySpy } from '../repositories/doubles/CrewRepositorySpy';
import { CrewModelFactory } from '../factories/CrewModelFactory';
import { CrewModel } from '../models/CrewModel';

describe('CrewStore', () => {
  let crew: CrewModel;
  let subject: CrewStore;

  beforeEach(() => {
    crew = CrewModelFactory.build();
    subject = new CrewStore(new CrewRepositorySpy(crew));
  });

  it('retrieves a crew by ID', async () => {
    await subject.setCrewId(1);
    expect(subject.crew).toEqual(crew);
  });

  it('sets the position attributes on a crew', () => {
    const expectedTitle = 'chimichanga';
    subject.setCrewPosition(1, {title: expectedTitle});
    subject.setCrewPosition(1, {critical: true});
    if (subject.crew) {
      const crewPosition = subject.crew.crewPositions.find(position => position.id === 1)!;
      expect(crewPosition.title).toBe(expectedTitle);
      expect(crewPosition.critical).toBeTruthy();
    }
  });
});