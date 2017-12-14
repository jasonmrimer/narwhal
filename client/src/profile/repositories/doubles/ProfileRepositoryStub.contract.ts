import ProfileRepositoryContract from '../ProfileRepositoryContract';
import ProfileRepositoryStub from './ProfileRepositoryStub';

describe('ProfileRepositoryStub', () => {
  ProfileRepositoryContract(new ProfileRepositoryStub());
});
