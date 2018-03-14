import * as moment from 'moment';
import { CertificationModel } from '../../skills/models/CertificationModel';
import { AirmanCertificationModel } from '../models/AirmanCertificationModel';

export class AirmanCertificationModelFactory {
  static build(id: number, siteId: number) {
    return new AirmanCertificationModel(
      1,
      new CertificationModel(id, `${id}`, siteId),
      moment(0).add(id, 'days'),
      moment(0).add(id, 'days'),
      1
    );
  }

  static buildList(amount: number, siteId: number) {
    return Array(amount).fill(null).map((_, i) => {
      return this.build(i, siteId);
    });
  }
}