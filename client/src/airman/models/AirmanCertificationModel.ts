import { Moment } from 'moment';
import CertificationModel from '../../skills/models/CertificationModel';
import { SkillType } from '../../skills/models/SkillType';

export default class AirmanCertificationModel {
  constructor(public airmanId: number,
              public certification: CertificationModel,
              public earnDate: Moment,
              public expirationDate: Moment,
              public id?: number) {
  }

  get type() {
    return SkillType.Certification;
  }

  get title() {
    return this.certification.title;
  }

  get skillId() {
    return this.certification.id;
  }
}
