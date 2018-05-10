import * as React from 'react';
import { Availability } from './Availability';
import { shallow, ShallowWrapper } from 'enzyme';
import { AvailabilityStore } from './stores/AvailabilityStore';
import { DoubleRepositories } from '../utils/Repositories';
import { StyledEventFormContainer } from './EventFormContainer';
import { StyledEventsList } from './EventsList';

let availabilityStore: AvailabilityStore;
let subject: ShallowWrapper;

describe('Availability', () => {

  beforeEach(() => {

    availabilityStore = new AvailabilityStore(DoubleRepositories);

    subject = shallow(
      <Availability
        availabilityStore={availabilityStore}
      />
    );
  });

  it('should render the events list', () => {
    expect(subject.find(StyledEventsList).exists()).toBeTruthy();
    expect(subject.find(StyledEventFormContainer).exists()).toBeFalsy();
  });

  it('should render the event form container', () => {
    availabilityStore.showEventForm(1);
    subject.update()
    expect(subject.find(StyledEventsList).exists()).toBeFalsy();
    expect(subject.find(StyledEventFormContainer).exists()).toBeTruthy();
  });
});