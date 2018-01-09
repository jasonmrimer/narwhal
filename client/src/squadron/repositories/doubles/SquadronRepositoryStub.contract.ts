import squadronRepositoryContract from '../SquadronRepositoryContract';
import SquadronRepositoryStub from './SquadronRepositoryStub';

describe('SquadronRepositoryStub', () => {
  squadronRepositoryContract(new SquadronRepositoryStub());
});