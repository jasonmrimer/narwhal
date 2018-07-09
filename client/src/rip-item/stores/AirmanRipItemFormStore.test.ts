import { AirmanRipItemFormStore } from './AirmanRipItemFormStore';
import { RipItemRepository } from '../../airman/repositories/AirmanRipItemRepository';
import { RipItemRepositoryStub } from '../../airman/repositories/doubles/AirmanRipItemRepositoryStub';
import { AirmanRipItemModel } from '../../airman/models/AirmanRipItemModel';
import { RipItemModel } from '../models/RipItemModel';
import * as moment from 'moment';

describe('AirmanRipItemFormStore', () => {
  let subject: AirmanRipItemFormStore;
  let ripItemRepository: RipItemRepository;

  beforeEach(() => {
    ripItemRepository = new RipItemRepositoryStub();
    ripItemRepository.updateAirmanRipItems = jest.fn();

    subject = new AirmanRipItemFormStore(ripItemRepository);
    subject.setRipItems(
      [
        new AirmanRipItemModel(1, 1, new RipItemModel(1, 'A'), null),
        new AirmanRipItemModel(2, 1, new RipItemModel(2, 'B'), moment().subtract(1, 'y')),
        new AirmanRipItemModel(3, 1, new RipItemModel(3, 'C'), moment().subtract(1, 'y')),
        new AirmanRipItemModel(4, 1, new RipItemModel(4, 'D'), moment().add(1, 'y')),
      ]);
  });

  it('should set RIP items', () => {
    expect(subject.ripItems.length).toBe(4);
  });

  it('should call updateAirmanRipItems', async () => {
    await subject.submitRipItems();
    expect(ripItemRepository.updateAirmanRipItems).toBeCalled();
  });

  it('should return the count of expired RIP items', () => {
    expect(subject.expiredItemCount).toBe(2);
  });

  it('should return the count of assigned RIP items', () => {
    expect(subject.assignedItemCount).toBe(3);
  });

  it('updateAllRipItems should only update previously assigned rip items', () => {
    let date = moment();
    let nullAmountBefore: number = 0;
    let nullAmountAfter: number = 0;

    subject.ripItems.map(ripItem => ripItem.expirationDate === null ? nullAmountBefore++ : null);

    subject.updateAllRipItems(date);

    subject.ripItems.map(ripItem => ripItem.expirationDate === null ? nullAmountAfter++ : null);

    subject.ripItems.forEach(ripItem => {
      if (ripItem.expirationDate !== null) {
        expect(ripItem.expirationDate.isSame(date));
      }
    });

    expect(nullAmountBefore === nullAmountAfter).toBeTruthy();
  });
});