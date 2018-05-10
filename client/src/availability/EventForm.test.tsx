import * as React from 'react';
import { EventType } from '../event/models/EventModel';
import { StyledTDYDeploymentForm } from '../event/TDYDeploymentForm';
import { StyledAppointmentForm } from '../event/AppointmentForm';
import { StyledLeaveForm } from '../event/LeaveForm';
import { shallow, ShallowWrapper } from 'enzyme';
import { AvailabilityStore } from './stores/AvailabilityStore';
import { AirmanModel } from '../airman/models/AirmanModel';
import { AirmanModelFactory } from '../airman/factories/AirmanModelFactory';
import { DoubleRepositories } from '../utils/Repositories';
import { EventForm } from './EventForm';
import { TrackerStore } from '../tracker/stores/TrackerStore';

describe('EventForm', () => {
  let availabilityStore: AvailabilityStore;
  let trackerStore: TrackerStore;
  let airman: AirmanModel;
  let subject: ShallowWrapper;

  beforeEach(() => {
    airman = AirmanModelFactory.build();
    availabilityStore = new AvailabilityStore(DoubleRepositories);
    availabilityStore.showEventForm(airman.id);
    trackerStore = new TrackerStore(DoubleRepositories);
    trackerStore.setSelectedAirman(airman);
    subject = shallow(<EventForm availabilityStore={availabilityStore} trackerStore={trackerStore}/>);
  });

  it('shows an appointment form', () => {
    availabilityStore.setEventFormType(EventType.Appointment);
    subject.update();
    expect(subject.find(StyledAppointmentForm).exists()).toBeTruthy();
  });

  it('shows a leave form', () => {
    availabilityStore.setEventFormType(EventType.Leave);
    subject.update();

    expect(subject.find(StyledLeaveForm).exists()).toBeTruthy();
  });

  it('shows a tdy/deployment form', () => {
    availabilityStore.setEventFormType(EventType.TDY_DEPLOYMENT);
    subject.update();

    expect(subject.find(StyledTDYDeploymentForm).exists()).toBeTruthy();
  });
});