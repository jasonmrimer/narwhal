import { Moment } from 'moment';

export interface SkillModel {
  displayText: string;
  periodicDue: Moment;
  currencyExpiration: Moment;
  lastSat: Moment;
}