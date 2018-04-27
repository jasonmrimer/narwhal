import * as moment from 'moment';
import { AirmanRipItemModel } from '../../airman/models/AirmanRipItemModel';
import { RipItemModel } from '../models/RipItemModel';

export class AirmanRipItemFactory {
  static buildList(airmanId: number, numOfChildren: number) {
    const ripItems = [];
    for (let i = 0; i < numOfChildren; i++) {
      ripItems.push(this.build(i, airmanId));
    }
    return ripItems;
  }

  static build(id: number, airmanId: number) {
    const ripItem = new RipItemModel(id, `Rip ${id}`);
    return new AirmanRipItemModel(id, airmanId, ripItem, moment().add(`${10 + id}`, 'days').add(5, 'hours'));
  }
}