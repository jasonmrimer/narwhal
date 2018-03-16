import { AirmanRipItemModel } from '../models/AirmanRipItemModel';

export interface RipItemRepository {
  findBySelectedAirman(id: number): Promise<AirmanRipItemModel[]>;
  updateAirmanRipItems(airmanRipItems: AirmanRipItemModel[]): Promise<AirmanRipItemModel[]>;
}