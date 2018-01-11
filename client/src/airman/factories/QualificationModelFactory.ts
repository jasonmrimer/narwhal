import QualificationModel from '../models/QualificationModel';
import * as moment from 'moment';

export default class QualificationModelFactory {
  static build(id: number) {
    return new QualificationModel(id, `${id}`, `${id}`, moment(0).add(id, 'days'));
  }

  static buildList(amount: number) {
    return Array(amount).fill(null).map((_, i) => {
      return this.build(i);
    });
  }
}