import * as React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import { PlannerHeader } from './PlannerHeader';
import { PlannerStore } from './stores/PlannerStore';
import { TimeServiceStub } from '../tracker/services/doubles/TimeServiceStub';
import { StyledDatePicker } from '../widgets/DatePicker';
import { DatePickerIcon } from './DatePickerIcon';
import * as moment from 'moment';

describe('PlannerHeader', () => {
  let subject: ShallowWrapper;
  let plannerStore: PlannerStore;

  beforeEach(() => {
    plannerStore = new PlannerStore(new TimeServiceStub());
    plannerStore.navigateToPlannerWeek = jest.fn();

    subject = shallow(<PlannerHeader plannerStore={plannerStore}/>);
  });

  it('should render header text', () => {
    expect(subject.text()).toContain('26SUN27MON28TUE29WED30THU01FRI02SAT');
  });

  it('should render a date picker with icon', () => {
    expect(subject.find(StyledDatePicker).exists()).toBeTruthy();
    expect(subject.find(DatePickerIcon).exists()).toBeTruthy();
  });

  it('should handle a calendar change to navigate the planner week', () => {
    const selectedDate = moment();
    subject.find(StyledDatePicker).simulate('change', {target: {name: '', value: selectedDate}});
    expect(plannerStore.navigateToPlannerWeek).toHaveBeenCalledWith(selectedDate);
  });

  it('should set the calendar calendarFocus state', () => {
    subject.find('.month-header').simulate('click');
    expect(subject.state('calendarFocus')).toBeTruthy();
  });

  it('should render next-week button', () => {
    expect(subject.find('button.next-week').exists()).toBeTruthy();
  });

  it('advances to last week on button click', () => {
    expect(subject.find('button.last-week').exists()).toBeTruthy();
  });
});