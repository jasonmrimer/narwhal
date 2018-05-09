import * as React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import * as moment from 'moment';
import { StyledDatePicker } from '../widgets/inputs/DatePicker';
import { AirmanRipItems } from './AirmanRipItemForm';
import { eventStub } from '../utils/testUtils';
import { AirmanRipItemFormStore } from './stores/AirmanRipItemFormStore';
import { RipItemRepositoryStub } from '../airman/repositories/doubles/AirmanRipItemRepositoryStub';
import { StyledButton } from '../widgets/buttons/Button';
import { AirmanRipItemModel } from '../airman/models/AirmanRipItemModel';
import { RipItemModel } from './models/RipItemModel';
import { StyledForm } from '../widgets/forms/Form';
import { CurrencyStore } from '../currency/stores/CurrencyStore';
import { DoubleRepositories } from '../utils/Repositories';
import { TrackerStore } from '../tracker/stores/TrackerStore';

describe('RipItems', () => {
  let airmanRipItemFormStore: AirmanRipItemFormStore;
  let currencyStore: CurrencyStore;
  let trackerStore: TrackerStore;
  let ripItemsActions: any;
  let subject: ShallowWrapper;

  beforeEach(async () => {

    airmanRipItemFormStore = new AirmanRipItemFormStore(new RipItemRepositoryStub());
    trackerStore = new TrackerStore(DoubleRepositories);
    currencyStore = new CurrencyStore(DoubleRepositories);
    const ripItem = new RipItemModel(1, 'NICKLEBACK');
    const airmanRipItem = [new AirmanRipItemModel(1, 1, ripItem, moment())];
    airmanRipItemFormStore.setRipItems(airmanRipItem);

    airmanRipItemFormStore.updateRipItem = jest.fn();
    airmanRipItemFormStore.submitRipItems = jest.fn();

    ripItemsActions = {
      updateRipItem: jest.fn(),
      updateAllRipItems: jest.fn(),
      submit: jest.fn()
    };

    subject = shallow(
      <AirmanRipItems
        airmanRipItemFormStore={airmanRipItemFormStore}
        selectedAirmanId={1}
        currencyStore={currencyStore}
        trackerStore={trackerStore}
        ripItemsActions={ripItemsActions}
      />
    );
  });

  it('should render a Form', () => {
    expect(subject.find(StyledForm).prop('setLoading')).toBe(trackerStore.setLoading);
  });

  it('should render the attributes of a RipItem', () => {
    const item = subject.find('.item');
    expect(item.length).toBe(1);
    expect(item.at(0).text()).toBe(airmanRipItemFormStore.ripItems[0].ripItem.title);
    expect(subject.find(StyledDatePicker).length).toBe(1);
    expect(subject.find(StyledButton).length).toBe(2);
  });

  it('should update the rip items expirationDate', () => {
    const expirationDate = moment().startOf('day');
    const modifiedExpirationDate = expirationDate.clone().add(10, 'days');

    subject.find(StyledDatePicker).at(0).simulate(
      'change',
      {
        target: {value: modifiedExpirationDate.format('YYYY-MM-DD')}
      }
    );

    expect(ripItemsActions.updateRipItem).toHaveBeenCalled();
  });

  it('should render a confirmation button with callback', async () => {
    const instance = (subject.instance() as AirmanRipItems);
    await instance.onSubmit(eventStub);
    expect(ripItemsActions.submit).toHaveBeenCalled();
  });

  it('should update the rip items expirationDate upon clicking the 90 day button', () => {
    subject.find(StyledButton).at(1).simulate('click');
    expect(ripItemsActions.updateRipItem).toHaveBeenCalled();
  });

  it('should update all the rip items expirationDate upon clicking the update all button', () => {
    subject
      .find(StyledButton)
      .findWhere(btn => btn.prop('text') === 'UPDATE ALL 90 DAYS')
      .simulate('click');
    expect(ripItemsActions.updateAllRipItems).toHaveBeenCalled();
  });
});