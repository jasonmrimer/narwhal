import { WebScheduleRepository } from './WebScheduleRepository';
import { HTTPClient } from '../../../utils/HTTPClient';
import { ScheduleRepositoryContract } from '../ScheduleRepositoryContract';

describe('WebScheduleRepository', () => {
  const client = new HTTPClient(process.env.REACT_APP_HOST || 'http://localhost:8080');
  ScheduleRepositoryContract(new WebScheduleRepository(client));
});
