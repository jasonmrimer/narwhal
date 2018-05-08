import * as React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import * as moment from 'moment';
import { StyledDatePicker } from '../widgets/DatePicker';
import { AirmanRipItems } from './AirmanRipItemForm';
import { eventStub } from '../utils/testUtils';
import { AirmanRipItemFormStore } from './stores/AirmanRipItemFormStore';
import { RipItemRepositoryStub } from '../airman/repositories/doubles/AirmanRipItemRepositoryStub';
import { StyledButton } from '../widgets/Button';
import { AirmanRipItemModel } from '../airman/models/AirmanRipItemModel';
import { RipItemModel } from './models/RipItemModel';
import { StyledForm } from '../widgets/Form';
import { CurrencyStore } from '../currency/stores/CurrencyStore';
import { DoubleRepositories } from '../utils/Repositories';
import { TrackerStore } from '../tracker/stores/TrackerStore';

describe('RipItems', () => {
  let store: AirmanRipItemFormStore;
  let currencyStore: CurrencyStore;
  let trackerStore: TrackerStore;
  let ripItemsActions: any;
  let subject: ShallowWrapper;

  beforeEach(async () => {

    store = new AirmanRipItemFormStore(new RipItemRepositoryStub());
    trackerStore = new TrackerStore(DoubleRepositories);
    currencyStore = new CurrencyStore(DoubleRepositories);
    const ripItem = new RipItemModel(1, 'NICKLEBACK');
    const airmanRipItem = [new AirmanRipItemModel(1, 1, ripItem, moment())];
    store.setRipItems(airmanRipItem);

    store.updateRipItem = jest.fn();
    store.submitRipItems = jest.fn();

    ripItemsActions = {
      handleChange: jest.fn(),
      submit: jest.fn()
    };

    subject = shallow(
      <AirmanRipItems
        airmanRipItemFormStore={store}
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
    expect(item.at(0).text()).toBe(store.ripItems[0].ripItem.title);
    expect(subject.find(StyledDatePicker).length).toBe(1);
    expect(subject.find(StyledButton).length).toBe(1);
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

    expect(ripItemsActions.handleChange).toHaveBeenCalled();
  });

  it('should render a confirmation button with callback', async () => {
    const instance = (subject.instance() as AirmanRipItems);
    await instance.onSubmit(eventStub);
    expect(ripItemsActions.submit).toHaveBeenCalled();
  });

  it('should update the rip items expirationDate upon clicking the 90 day button', () => {
    subject.find(StyledButton).at(0).simulate('click');
    expect(ripItemsActions.handleChange).toHaveBeenCalled();
  });
});