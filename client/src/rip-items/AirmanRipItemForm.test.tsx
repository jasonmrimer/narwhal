import * as React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import * as moment from 'moment';
import { StyledDatePicker } from '../widgets/DatePicker';
import { AirmanRipItems } from './AirmanRipItemForm';
import { eventStub } from '../utils/testUtils';
import { AirmanRipItemFormStore } from './stores/AirmanRipItemFormStore';
import { RipItemRepositoryStub } from '../airman/repositories/doubles/AirmanRipItemRepositoryStub';
import { StyledButton } from '../widgets/Button';
import Mock = jest.Mock;
import { AirmanRipItemModel } from '../airman/models/AirmanRipItemModel';
import { RipItemModel } from './models/RipItemModel';

describe('RipItems', () => {
  let store: AirmanRipItemFormStore;
  let subject: ShallowWrapper;
  let closeSpy: Mock;

  beforeEach(async () => {
    closeSpy = jest.fn();
    const closeable = {
      closeAirmanRipItemForm: closeSpy
    };

    store = new AirmanRipItemFormStore(closeable, new RipItemRepositoryStub());
    const ripItem = new RipItemModel(1, 'NICKLEBACK');
    const airmanRipItem = [new AirmanRipItemModel(1, 1, ripItem, moment())];
    store.setRipItems(airmanRipItem);

    store.updateRipItem = jest.fn();
    store.submitRipItems = jest.fn();

    subject = shallow(<AirmanRipItems store={store} selectedAirmanId={1}/>);
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

  it('should update the rip items expirationDate upon clicking the 90 day button', () => {
    subject.find(StyledButton).at(0).simulate('click');

    expect(store.updateRipItem).toHaveBeenCalled();

    const updatedDate = (store.updateRipItem as Mock).mock.calls[0][0].expirationDate;
    expect(updatedDate.startOf('day').isSame(moment().add(90, 'days').startOf('day'))).toBeTruthy();
  });

  it('should NOT update the rip items expirationDate beyond 90 days', () => {
    const add90DaysButton = subject.find(StyledButton).at(0);
    add90DaysButton.simulate('click');
    add90DaysButton.simulate('click');

    const updatedDate = (store.updateRipItem as Mock).mock.calls[1][0].expirationDate;
    expect(updatedDate.startOf('day').isSame(moment().add(90, 'days').startOf('day'))).toBeTruthy();
  });
});