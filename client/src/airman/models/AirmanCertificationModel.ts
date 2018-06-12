import * as moment from 'moment';
import { CertificationModel } from '../../skills/certification/models/CertificationModel';
import { SkillType } from '../../skills/models/SkillType';
import { Moment } from 'moment';
import { SkillModel } from './SkillModel';

export class AirmanCertificationModel implements SkillModel {
  constructor(public airmanId: number,
              public certification: CertificationModel,
              public earnDate: Moment,
              public expirationDate: Moment,
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
    return this.expirationDate.isBefore(moment().add(14, 'days'));
  }
}
