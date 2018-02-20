import { CrewRepositoryStub } from './CrewRepositoryStub';
import { crewRepositoryContract } from '../CrewRepositoryContract';
import { CrewModelFactory } from '../../factories/CrewModelFactory';

describe('CrewRepositoryStub', () => {
  const crew = CrewModelFactory.build();
  crewRepositoryContract(new CrewRepositoryStub(crew));
});
