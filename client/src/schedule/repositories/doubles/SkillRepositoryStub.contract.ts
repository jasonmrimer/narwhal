import { ScheduleRepositoryContract } from '../ScheduleRepositoryContract';
import { ScheduleRepositoryStub } from './ScheduleRepositoryStub';

describe('ScheduleRepositoryStub', () => {
  ScheduleRepositoryContract(new ScheduleRepositoryStub());
});
