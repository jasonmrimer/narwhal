import { CrewStore } from './CrewStore';
import { CrewRepositorySpy } from '../repositories/doubles/CrewRepositorySpy';
import { CrewModelFactory } from '../factories/CrewModelFactory';

describe('CrewStore', () => {
  it('retrieves a crew by ID', async () => {
    const crew = CrewModelFactory.build();

    const subject = new CrewStore(new CrewRepositorySpy(crew));
    await subject.setCrewId(1);
    expect(subject.crew).toEqual(crew);
  });

  it('sets the position title on a crew', () => {
    const crew = CrewModelFactory.build();
    const expected = 'chimichanga';

    const subject = new CrewStore(new CrewRepositorySpy(crew));
    subject.setCrewPositionTitle(1, expected);

    if (subject.crew) {
      const crewPosition = subject.crew.crewPositions.find(position => position.id === 1)!;
      expect(crewPosition.title).toBe(expected);
    }
  });
});