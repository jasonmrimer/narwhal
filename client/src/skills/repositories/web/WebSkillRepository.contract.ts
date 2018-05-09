import { SkillRepositoryContract } from '../SkillRepositoryContract';
import { WebSkillRepository } from './WebSkillRepository';
import { HTTPClient } from '../../../utils/HTTPClient';

describe('WebRankRepository', () => {
  const client = new HTTPClient(process.env.REACT_APP_HOST || 'http://localhost:8080');
  SkillRepositoryContract(new WebSkillRepository(client));
});
