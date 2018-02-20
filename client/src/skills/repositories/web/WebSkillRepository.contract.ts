import { SkillRepositoryContract } from '../SkillRepositoryContract';
import { WebSkillRepository } from './WebSkillRepository';

describe('WebSkillRepository', () => {
  const HOST = process.env.REACT_APP_HOST || 'http://localhost:8080';
  SkillRepositoryContract(new WebSkillRepository(HOST));
});
