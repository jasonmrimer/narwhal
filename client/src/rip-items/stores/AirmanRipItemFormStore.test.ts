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
        new AirmanRipItemModel(1, 1, new RipItemModel(1, 'goober'), null),
        new AirmanRipItemModel(2, 1, new RipItemModel(2, 'face'), moment()),
      ]);
  });

  it('should set RIP items', async () => {
    expect(subject.ripItems.length).toBe(2);
  });

  it('should call updateAirmanRipItems', async () => {
    await subject.submitRipItems();
    expect(ripItemRepository.updateAirmanRipItems).toBeCalled();
    expect(closeSpy).toHaveBeenCalled();
  });

  it('should return true when hasExpiredItem in rip items array', () => {
    expect(subject.hasExpiredItem).toBeTruthy();
  });
});