import { Moment } from 'moment';
import { RipItemModel } from '../../rip-items/models/RipItemModel';

export class AirmanRipItemModel {
  constructor(public id: number,
              public airmanId: number,
              public ripItem: RipItemModel,
              public expirationDate: Moment | null) {

  }
}