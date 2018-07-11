import * as moment from 'moment';
import { CertificationModel } from '../../skills/certification/models/CertificationModel';
import { SkillType } from '../../skills/models/SkillType';
import { Moment } from 'moment';
import { SkillModel } from './SkillModel';
import { DaysToExpiration } from './AirmanModel';

export class AirmanCertificationModel implements SkillModel {
  constructor(public airmanId: number,
              public certification: CertificationModel,
              public earnDate: Moment,
              public periodicDue: Moment,
              public currencyExpiration: Moment,
              public lastSat: Moment,
              public id: number | null = null) {
  }

  get type() {
    return SkillType.Certification;
  }

  get title() {
    return this.certification.title;
  }

  get displayText() {
    return this.certification.title;
  }

  get skillId() {
    return this.certification.id;
  }

  get isExpired() {
    return this.periodicDue.isBefore(moment().add(DaysToExpiration, 'days'));
  }
}
