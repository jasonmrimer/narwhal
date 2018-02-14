import { default as SkillRepositoryStub } from './SkillRepositoryStub';
import { SkillRepositoryContract } from '../SkillRepositoryContract';

describe('SkillRepositoryStub', () => {
  SkillRepositoryContract(new SkillRepositoryStub());
});
