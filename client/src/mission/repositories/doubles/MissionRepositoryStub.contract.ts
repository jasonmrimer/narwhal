import { MissionRepositoryContract } from '../MissionRepositoryContract';
import { MissionRepositoryStub } from './MissionRepositoryStub';

describe('MissionRepositoryStub', () => {
  MissionRepositoryContract(new MissionRepositoryStub());
});
