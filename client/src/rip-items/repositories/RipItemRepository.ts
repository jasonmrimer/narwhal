import { RipItemModel } from '../models/RipItemModel';

export interface RipItemRepository {
  findAll(): Promise<RipItemModel[]>;
}