import { airmanRepositoryContract } from '../AirmanRepositoryContract';
import { AirmanRepositoryStub } from './AirmanRepositoryStub';

describe('AirmanRepositoryStub', () => {
  airmanRepositoryContract(new AirmanRepositoryStub());
});