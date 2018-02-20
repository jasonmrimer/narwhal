import { CrewStore } from './CrewStore';
import { CrewRepositoryStub } from '../repositories/doubles/CrewRepositoryStub';
import { CrewModelFactory } from '../factories/CrewModelFactory';

describe('CrewStore', () => {
  it('retrieves a crew by mission ID', async () => {
    const crew = CrewModelFactory.build();

    const subject = new CrewStore(new CrewRepositoryStub(crew));
    await subject.setCrewId(1);
    expect(subject.crew).toEqual(crew);
  });
});