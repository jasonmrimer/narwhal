import CertificationModel from '../models/CertificationModel';
import * as moment from 'moment';

export default class CertificationModelFactory {
  static build(id: number) {
    return new CertificationModel(id, `${id}`, moment(0).add(id, 'd'));
  }

  static buildList(amount: number) {
    return Array(amount).fill(null).map((_, i) => {
      return this.build(i);
    });
  }
}