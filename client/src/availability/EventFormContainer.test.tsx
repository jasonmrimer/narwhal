import * as React from 'react';
import { StyledRadioButtons } from '../widgets/inputs/RadioButtons';
import { AvailabilityStore } from './stores/AvailabilityStore';
import { DoubleRepositories } from '../utils/Repositories';
import { AirmanModel } from '../airman/models/AirmanModel';
import { AirmanModelFactory } from '../airman/factories/AirmanModelFactory';
import { shallow, ShallowWrapper } from 'enzyme';
import { EventFormContainer } from './EventFormContainer';

describe('EventFormContainer', () => {
  let availabilityStore: AvailabilityStore;
  let airman: AirmanModel;
  let subject: ShallowWrapper;

  beforeEach(() => {
    airman = AirmanModelFactory.build();
    availabilityStore = new AvailabilityStore(DoubleRepositories);
    subject = shallow(<EventFormContainer availabilityStore={availabilityStore}/>);
  });

  it('renders event type radio buttons form after calling show event form', () => {
    availabilityStore.showEventForm(airman.id);
    subject.update();
    expect(subject.find(StyledRadioButtons).exists()).toBeTruthy();
  });
});