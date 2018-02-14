import { ProfileRepositoryContract } from '../ProfileRepositoryContract';
import { WebProfileRepository } from './WebProfileRepository';

describe('WebProfileRepository', () => {
  const HOST = process.env.REACT_APP_HOST || 'http://localhost:8080';
  ProfileRepositoryContract(new WebProfileRepository(HOST));
});
