import { ScheduleRepositoryContract } from '../ScheduleRepositoryContract';
import { ScheduleRepositoryStub } from './ScheduleRepositoryStub';

describe('RankRepositoryStub', () => {
  ScheduleRepositoryContract(new ScheduleRepositoryStub());
});
