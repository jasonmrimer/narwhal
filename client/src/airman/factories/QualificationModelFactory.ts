import QualificationModel from '../models/QualificationModel';
import * as moment from 'moment';
import { randomText } from '../../utils/randomizer';

export default class QualificationModelFactory {
  static build(id: number) {
    return new QualificationModel(id, randomText(3), randomText(8), moment.utc());
  }

  static buildList(amount: number) {
    return Array(amount).fill(null).map((_, i) => {
      return this.build(i);
    });
  }
}