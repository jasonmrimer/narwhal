import * as React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import { PlannerStore } from '../roster/stores/PlannerStore';
import { TimeServiceStub } from '../tracker/services/doubles/TimeServiceStub';
import { EventsList } from './EventsList';
import { AvailabilityActions } from './AvailabilityActions';
import { StyledEvent } from './Event';
import { PlusIcon } from '../icons/PlusIcon';

describe('EventList', () => {
  let subject: ShallowWrapper;
  let availabilityActions: AvailabilityActions;
  let plannerStore: PlannerStore;

  beforeEach(() => {
    plannerStore = new PlannerStore(new TimeServiceStub());
    availabilityActions = new AvailabilityActions({});
    availabilityActions.openEventForm = jest.fn();
    availabilityActions.incrementWeek = jest.fn();
    availabilityActions.decrementWeek = jest.fn();
    subject = shallow(<EventsList plannerStore={plannerStore}  availabilityActions={availabilityActions}/>);
  });

  it('renders the availability for an airman', () => {
    expect(subject.text()).toContain('26 NOV - 02 DEC');
    expect(subject.find(StyledEvent).length).toBe(7);
  });

  it('renders an Add Event button', () => {
    expect(subject.find('button.add-event').exists()).toBeTruthy();
    expect(subject.find('button.add-event').find(PlusIcon)).toBeTruthy();
    expect(subject.find('button.add-event').text()).toContain('Add Event');
  });

  it('forwards availability to next week', () => {
    subject.find('button.next-week').simulate('click');
    expect(availabilityActions.incrementWeek).toHaveBeenCalled();
  });

  it('advanced to previous weeks', () => {
    subject.find('button.last-week').simulate('click');
    expect(availabilityActions.decrementWeek).toHaveBeenCalled();
  });
});