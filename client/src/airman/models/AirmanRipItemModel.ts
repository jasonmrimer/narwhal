import * as moment from 'moment';
import { Moment } from 'moment';
import { RipItemModel } from '../../rip-item/models/RipItemModel';
import { observable } from 'mobx';

export class AirmanRipItemModel {
  @observable public expirationDate: Moment | null = null;

  constructor(public id: number,
              public airmanId: number,
              public ripItem: RipItemModel,
              expirationDate: Moment | null) {
    this.expirationDate = expirationDate;
  }

  get isExpired() {
    if (this.expirationDate) {
      return this.expirationDate.isBefore(moment().add(14, 'days'));
    }
    return false;
  }
}