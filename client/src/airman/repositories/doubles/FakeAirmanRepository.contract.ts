import { airmanRepositoryContract } from '../AirmanRepositoryContract';
import { FakeAirmanRepository } from './FakeAirmanRepository';

describe('FakeAirmanRepository', () => {
  airmanRepositoryContract(new FakeAirmanRepository());
});