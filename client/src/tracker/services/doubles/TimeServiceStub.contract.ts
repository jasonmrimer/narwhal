import { TimeServiceContract } from '../TimeServiceContract';
import { TimeServiceStub } from './TimeServiceStub';

describe('TimeServiceStub', () => {
  TimeServiceContract(new TimeServiceStub());
});