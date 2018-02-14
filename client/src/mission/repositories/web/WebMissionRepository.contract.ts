import { MissionRepositoryContract } from '../MissionRepositoryContract';
import { WebMissionRepository } from './WebMissionRepository';

describe('WebMissionRepository', () => {
  const HOST = process.env.REACT_APP_HOST || 'http://localhost:8080';
  MissionRepositoryContract(new WebMissionRepository(HOST));
});
