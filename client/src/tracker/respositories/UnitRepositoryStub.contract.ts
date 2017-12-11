import unitRepositoryContract from './UnitRepositoryContract';
import UnitRepositoryStub from './UnitRepositoryStub';

describe('UnitRepositoryStub', () => {
  unitRepositoryContract(new UnitRepositoryStub());
});