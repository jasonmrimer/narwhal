import { AirmanRipItemFormStore } from './AirmanRipItemFormStore';
import { RipItemRepository } from '../../airman/repositories/AirmanRipItemRepository';
import { RipItemRepositoryStub } from '../../airman/repositories/doubles/AirmanRipItemRepositoryStub';
import Mock = jest.Mock;

describe('AirmanRipItemStore', () => {
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
  });

  it('should populate RIP items', async () => {
    await subject.hydrate(1);
    expect(subject.ripItems.length).toBe(1);
  });

  it('should call updateAirmanRipItems', async () => {
    await subject.submitRipItems();
    expect(ripItemRepository.updateAirmanRipItems).toBeCalled();
    expect(closeSpy).toHaveBeenCalled();
  });
});