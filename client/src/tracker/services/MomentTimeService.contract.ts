import { TimeServiceContract } from './TimeServiceContract';
import { MomentTimeService } from './MomentTimeService';

describe('MomentTimeService', () => {
  TimeServiceContract(new MomentTimeService());
});