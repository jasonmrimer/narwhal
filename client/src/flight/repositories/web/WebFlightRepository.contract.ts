import FlightRepositoryContract from '../FlightRepositoryContract';
import WebFlightRepository from './WebFlightRepository';

describe('WebFlightRepository', () => {
  const HOST = process.env.REACT_APP_HOST || 'http://localhost:8080';
  FlightRepositoryContract(new WebFlightRepository(HOST));
});
