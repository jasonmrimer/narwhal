import { RipItemRepository } from '../AirmanRipItemRepository';
import { RipItemModel } from '../../../rip-item/models/RipItemModel';
import { AirmanRipItemModel } from '../../models/AirmanRipItemModel';
import * as moment from 'moment';
import { AirmanRipItemFactory } from '../../../rip-item/factories/AirmanRipItemFactory';

export class RipItemRepositoryStub implements RipItemRepository {
  findBySelectedAirman(id: number): Promise<AirmanRipItemModel[]> {
    const items = [
      AirmanRipItemFactory.build(1, 2),
      AirmanRipItemFactory.build(2, 2),
    ];
    items[0].expirationDate = moment().subtract(2, 'days');
    items[1].expirationDate = moment().add(13, 'days');
    return Promise.resolve(items.filter(i => i.airmanId === id));
  }

  updateAirmanRipItems(airmanRipItems: AirmanRipItemModel[]): Promise<AirmanRipItemModel[]> {
    const ripItem = new RipItemModel(1, 'NICKLEBACK');
    const airmanRipItem = [new AirmanRipItemModel(1, 1, ripItem, moment())];
    return Promise.resolve(airmanRipItem);
  }
}