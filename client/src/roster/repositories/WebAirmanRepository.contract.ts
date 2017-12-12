import airmanRepositoryContract from './AirmanRepositoryContract';
import WebAirmanRepository from './WebAirmanRepository';

describe('WebAirmanRepository', () => {
  const HOST = process.env.REACT_APP_HOST || 'http://localhost:8080';
  airmanRepositoryContract(new WebAirmanRepository(HOST));
});