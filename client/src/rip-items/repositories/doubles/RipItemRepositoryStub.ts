import { RipItemRepository } from '../RipItemRepository';
import { RipItemModel } from '../../models/RipItemModel';

export class RipItemRepositoryStub implements RipItemRepository {
  findAll(): Promise<RipItemModel[]> {
    const ripItems = [new RipItemModel(1, 'NICKLEBACK')];
    return Promise.resolve(ripItems);
  }
}