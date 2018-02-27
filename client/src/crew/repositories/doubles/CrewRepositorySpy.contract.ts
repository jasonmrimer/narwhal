import { CrewRepositorySpy } from './CrewRepositorySpy';
import { crewRepositoryContract } from '../CrewRepositoryContract';
import { CrewModelFactory } from '../../factories/CrewModelFactory';

describe('CrewRepositorySpy', () => {
  const crew = CrewModelFactory.build();
  crewRepositoryContract(new CrewRepositorySpy(crew));
});
