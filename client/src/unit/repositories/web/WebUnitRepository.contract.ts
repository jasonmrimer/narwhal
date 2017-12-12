import unitRepositoryContract from '../UnitRepositoryContract';
import WebUnitRepository from './WebUnitRepository';

describe('WebUnitRepository', () => {
  const HOST = process.env.REACT_APP_HOST || 'http://localhost:8080';
  unitRepositoryContract(new WebUnitRepository(HOST));
});