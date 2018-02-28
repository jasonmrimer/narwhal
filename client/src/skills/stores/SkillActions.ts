import { Skill } from '../models/Skill';
import { FilterOption } from '../../widgets/models/FilterOptionModel';

export interface SkillActions {
  addSkill: (skill: Skill) => void;
  removeSkill: (skill: Skill) => void;
  qualificationOptions: FilterOption[];
  certificationOptions: FilterOption[];
}