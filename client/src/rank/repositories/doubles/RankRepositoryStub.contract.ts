import { RankRepositoryContract } from '../RankRepositoryContract';
import { RankRepositoryStub } from './RankRepositoryStub';

describe('RankRepositoryStub', () => {
  RankRepositoryContract(new RankRepositoryStub());
});
