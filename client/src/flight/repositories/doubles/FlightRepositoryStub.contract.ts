import FlightRepositoryContract from '../FlightRepositoryContract';
import FlightRepositoryStub from './FlightRepositoryStub';

describe('FlightRepositoryStub', () => {
  FlightRepositoryContract(new FlightRepositoryStub());
});
