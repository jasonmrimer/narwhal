import { ProfileRepositoryContract } from '../ProfileRepositoryContract';
import { WebProfileRepository } from './WebProfileRepository';
import { HTTPClient } from '../../../utils/HTTPClient';

describe('WebProfileRepository', () => {
  const client = new HTTPClient(process.env.REACT_APP_HOST || 'http://localhost:8080');
  ProfileRepositoryContract(new WebProfileRepository(client));
});
