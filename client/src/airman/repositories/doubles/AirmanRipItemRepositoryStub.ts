import { RipItemRepository } from '../AirmanRipItemRepository';
import { RipItemModel } from '../../../rip-items/models/RipItemModel';
import { AirmanRipItemModel } from '../../models/AirmanRipItemModel';
import * as moment from 'moment';

export class RipItemRepositoryStub implements RipItemRepository {
  findBySelectedAirman(id: number): Promise<AirmanRipItemModel[]> {
    const ripItem = new RipItemModel(1, 'NICKLEBACK');
    const airmanRipItem = [new AirmanRipItemModel(1, id, ripItem, moment())];
    return Promise.resolve(airmanRipItem);
  }

  updateAirmanRipItems(airmanRipItems: AirmanRipItemModel[]): Promise<AirmanRipItemModel[]> {
    const ripItem = new RipItemModel(1, 'NICKLEBACK');
    const airmanRipItem = [new AirmanRipItemModel(1, 1, ripItem, moment())];
    return Promise.resolve(airmanRipItem);
  }
}