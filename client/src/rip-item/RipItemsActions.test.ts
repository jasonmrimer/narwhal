import { RipItemsActions } from './RipItemsActions';
import * as moment from 'moment';
import { AirmanRipItemFactory } from './factories/AirmanRipItemFactory';

describe('RipItemActions', () => {
  let airmanRipItemFormStore: any;
  let subject: RipItemsActions;

  beforeEach(() => {
    airmanRipItemFormStore = {
      ripItems: AirmanRipItemFactory.buildList(1, 2),
      updateAllRipItems: jest.fn()
    };
    subject = new RipItemsActions({airmanRipItemFormStore});
  });

  it('should update the expiration date for all rip items', () => {
    const expirationDate = moment(0);
    subject.updateAllRipItems(expirationDate);
    expect(airmanRipItemFormStore.updateAllRipItems).toHaveBeenCalledWith(expirationDate);
  });
});