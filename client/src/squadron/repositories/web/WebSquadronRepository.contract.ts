import squadronRepositoryContract from '../SquadronRepositoryContract';
import WebSquadronRepository from './WebSquadronRepository';

describe('WebSquadronRepository', () => {
  const HOST = process.env.REACT_APP_HOST || 'http://localhost:8080';
  squadronRepositoryContract(new WebSquadronRepository(HOST));
});
