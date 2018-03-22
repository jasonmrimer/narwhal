import { Moment } from 'moment';
import { RipItemModel } from '../../rip-items/models/RipItemModel';
import * as moment from 'moment';

export class AirmanRipItemModel {
  constructor(public id: number,
              public airmanId: number,
              public ripItem: RipItemModel,
              public expirationDate: Moment | null) {
  }

  get isExpired() {
    if (this.expirationDate) {
      return this.expirationDate.isBefore(moment().add(14, 'days'));
    }
    return false;
  }
}