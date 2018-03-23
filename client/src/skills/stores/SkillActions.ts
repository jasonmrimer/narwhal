import { Skill } from '../models/Skill';

export interface SkillActions {
  siteId: number;
  addSkill: (skill: Skill) => void;
  removeSkill: (skill: Skill) => void;
}