import * as moment from 'moment';
import { Moment } from 'moment';
import { QualificationModel } from '../../skills/qualifications/models/QualificationModel';
import { SkillType } from '../../skills/models/SkillType';
import { SkillModel } from './SkillModel';
import { DaysToExpiration } from './AirmanModel';

export class AirmanQualificationModel implements SkillModel {
  constructor(public airmanId: number,
              public qualification: QualificationModel,
              public earnDate: Moment,
              public periodicDue: Moment,
              public currencyExpiration: Moment,
              public lastSat: Moment,
              public id: number | null = null) {
  }

  get type() {
    return SkillType.Qualification;
  }

  get acronym() {
    return this.qualification.acronym;
  }

  get displayText() {
    return this.qualification.acronym;
  }

  get title() {
    return `${this.qualification.acronym} - ${this.qualification.title}`;
  }

  get skillId() {
    return this.qualification.id;
  }

  get isExpired() {
    return this.periodicDue.isBefore(moment().add(DaysToExpiration, 'days'));
  }
}
