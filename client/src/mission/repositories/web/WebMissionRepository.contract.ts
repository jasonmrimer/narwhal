import { MissionRepositoryContract } from '../MissionRepositoryContract';
import { WebMissionRepository } from './WebMissionRepository';
import { HTTPClient } from '../../../utils/HTTPClient';

describe('WebMissionRepository', () => {
  const client = new HTTPClient(process.env.REACT_APP_HOST || 'http://localhost:8080');
  MissionRepositoryContract(new WebMissionRepository(client));
});
