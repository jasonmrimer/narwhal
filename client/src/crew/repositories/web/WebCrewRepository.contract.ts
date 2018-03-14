import { crewRepositoryContract } from '../CrewRepositoryContract';
import { WebCrewRepository } from './WebCrewRepository';
import { HTTPClient } from '../../../HTTPClient';

describe('WebCrewRepository', () => {
  const client = new HTTPClient(process.env.REACT_APP_HOST || 'http://localhost:8080');
  crewRepositoryContract(new WebCrewRepository(client));
});
