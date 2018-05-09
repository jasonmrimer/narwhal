import { SkillRepositoryContract } from '../SkillRepositoryContract';
import { SkillRepositoryStub } from './SkillRepositoryStub';

describe('SkillRepositoryStub', () => {
  SkillRepositoryContract(new SkillRepositoryStub());
});
