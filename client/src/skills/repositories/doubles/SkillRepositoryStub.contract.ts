import { default as SkillRepositoryContract } from '../SkillRepositoryContract';
import { default as SkillRepositoryStub } from './SkillRepositoryStub';

describe('SkillRepositoryStub', () => {
  SkillRepositoryContract(new SkillRepositoryStub());
});
