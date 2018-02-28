import { Moment } from 'moment';
import { SkillType } from './SkillType';

export interface Skill {
  id: number | null;
  type: SkillType;
  airmanId: number;
  skillId: number;
  earnDate: Moment;
  expirationDate: Moment;
}