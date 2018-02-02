import { Moment } from 'moment';
import CertificationModel from '../../skills/models/CertificationModel';

export default class AirmanCertificationModel {
  constructor(public airmanId: number,
              public certification: CertificationModel,
              public earnDate: Moment,
              public expirationDate: Moment,
              public id?: number) {
  }

  get title() {
    return this.certification.title;
  }
}
