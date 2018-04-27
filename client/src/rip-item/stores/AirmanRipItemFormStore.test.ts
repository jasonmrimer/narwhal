import { AirmanRipItemFormStore } from './AirmanRipItemFormStore';
import { RipItemRepository } from '../../airman/repositories/AirmanRipItemRepository';
import { RipItemRepositoryStub } from '../../airman/repositories/doubles/AirmanRipItemRepositoryStub';
import { AirmanRipItemModel } from '../../airman/models/AirmanRipItemModel';
import { RipItemModel } from '../models/RipItemModel';
import * as moment from 'moment';
import Mock = jest.Mock;

describe('AirmanRipItemFormStore', () => {
  let subject: AirmanRipItemFormStore;
  let ripItemRepository: RipItemRepository;
  let closeSpy: Mock;

  beforeEach(() => {
    ripItemRepository = new RipItemRepositoryStub();
    ripItemRepository.updateAirmanRipItems = jest.fn();

    closeSpy = jest.fn();
    const closeable = {
      closeAirmanRipItemForm: closeSpy
    };

    subject = new AirmanRipItemFormStore(closeable, ripItemRepository);
    subject.setRipItems(
      [
        new AirmanRipItemModel(1, 1, new RipItemModel(1, 'A'), null),
        new AirmanRipItemModel(2, 1, new RipItemModel(2, 'B'), moment().subtract(1, 'y')),
        new AirmanRipItemModel(3, 1, new RipItemModel(3, 'C'), moment().subtract(1, 'y')),
        new AirmanRipItemModel(4, 1, new RipItemModel(4, 'D'), moment().add(1, 'y')),
      ]);
  });

  it('should set RIP items', async () => {
    expect(subject.ripItems.length).toBe(4);
  });

  it('should call updateAirmanRipItems', async () => {
    await subject.submitRipItems();
    expect(ripItemRepository.updateAirmanRipItems).toBeCalled();
    expect(closeSpy).toHaveBeenCalled();
  });

  it('should return the count of expired RIP items', () => {
    expect(subject.expiredItemCount).toBe(2);
  });

  it('should return the count of assigned RIP items', () => {
    expect(subject.assignedItemCount).toBe(3);
  });
});