import * as React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import * as moment from 'moment';
import { Moment } from 'moment';
import { StyledDatePicker } from '../widgets/DatePicker';
import { AirmanRipItems } from './AirmanRipItemForm';
import { eventStub } from '../utils/testUtils';
import { AirmanRipItemFormStore } from './stores/AirmanRipItemFormStore';
import { RipItemRepositoryStub } from '../airman/repositories/doubles/AirmanRipItemRepositoryStub';
import Mock = jest.Mock;

describe('RipItems', () => {
  let store: AirmanRipItemFormStore;
  let subject: ShallowWrapper;
  let expirationDate: Moment;
  let closeSpy: Mock;

  beforeEach(async () => {
    expirationDate = moment().startOf('day');
    closeSpy = jest.fn();

    const closeable = {
      closeAirmanRipItemForm: closeSpy
    };

    store = new AirmanRipItemFormStore(closeable, new RipItemRepositoryStub());
    await store.hydrate(1);

    store.updateRipItem = jest.fn();
    store.submitRipItems = jest.fn();

    subject = shallow(<AirmanRipItems store={store} selectedAirmanId={1}/>);
  });

  it('should render the attributes of a RipItem', () => {
    expect(subject.find('.item').length).toBe(1);
    expect(subject.find(StyledDatePicker).length).toBe(1);
  });

  it('should update the rip items expirationDate', () => {
    const modifiedExpirationDate = expirationDate.clone().add(90, 'days');

    subject.find(StyledDatePicker).at(0).simulate('change', {target: {value: modifiedExpirationDate.format('YYYY-MM-DD')}});

    expect(store.updateRipItem).toHaveBeenCalled();
    const updatedDate = (store.updateRipItem as Mock).mock.calls[0][0].expirationDate;
    expect(updatedDate.startOf('day').isSame(modifiedExpirationDate)).toBeTruthy();
  });

  it('should render a confirmation button with callback', () => {
    const instance = (subject.instance() as AirmanRipItems);
    instance.onSubmit(eventStub);
    expect(store.submitRipItems).toHaveBeenCalled();
  });
});