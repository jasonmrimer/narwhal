import CertificationModel from './models/CertificationModel';
import * as moment from 'moment';
import { randomText } from '../utils/randomizer';

export default class CertificationModelFactory {
  static build(id: number) {
    return new CertificationModel(id, randomText(1), moment.utc());
  }

  static buildList(amount: number) {
    return Array(amount).fill(null).map((_, i) => {
      return this.build(i);
    });
  }
}