import { airmanRepositoryContract } from '../AirmanRepositoryContract';
import { WebAirmanRepository } from './WebAirmanRepository';
import { HTTPClient } from '../../../HTTPClient';

describe('WebAirmanRepository', () => {
  const client = new HTTPClient(process.env.REACT_APP_HOST || 'http://localhost:8080');
  airmanRepositoryContract(new WebAirmanRepository(client));
});