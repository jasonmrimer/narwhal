import * as React from 'react';
import * as moment from 'moment';
import { Availability } from './Availability';
import { EventModel, EventType } from '../event/models/EventModel';
import { AirmanModel } from '../airman/models/AirmanModel';
import { AirmanModelFactory } from '../airman/factories/AirmanModelFactory';
import { StyledAvailabilityTile } from './AvailabilityTile';
import { TrackerStore } from '../tracker/stores/TrackerStore';
import { shallow, ShallowWrapper } from 'enzyme';
import { StyledRadioButtons } from '../widgets/RadioButtons';
import { StyledAppointmentForm } from '../event/AppointmentForm';
import { StyledLeaveForm } from '../event/LeaveForm';
import { EventModelFactory } from '../event/factories/EventModelFactory';
import { StyledTDYDeploymentForm } from '../event/TDYDeploymentForm';
import { AvailabilityStore } from './stores/AvailabilityStore';
import { PlannerStore } from '../roster/stores/PlannerStore';
import { DoubleRepositories } from '../utils/Repositories';
import { TimeServiceStub } from '../tracker/services/doubles/TimeServiceStub';

let trackerStore: TrackerStore;
let availabilityStore: AvailabilityStore;
let plannerStore: PlannerStore;
let airman: AirmanModel;
let subject: ShallowWrapper;
let eventOne: EventModel;
let eventTwo: EventModel;
let eventThree: EventModel;
let eventFour: EventModel;

describe('Availability', () => {
  let availabilityActions: any;

  beforeEach(() => {
    airman = AirmanModelFactory.build();

    availabilityActions = {
      openEventFormForDay: jest.fn(),
      incrementWeek: jest.fn(),
      decrementWeek: jest.fn(),
      openEventForm: jest.fn(),
    };

    eventOne = new EventModel(
      'Event One',
      '',
      moment('2017-11-27'),
      moment('2017-11-27'),
      1,
      EventType.Appointment
    );
    eventTwo = new EventModel(
      'Event Two',
      '',
      moment('2017-11-27'),
      moment('2017-11-28'),
      1,
      EventType.Mission
    );
    eventThree = new EventModel(
      'Event Three',
      '',
      moment('2017-11-27'),
      moment('2017-11-30'),
      1,
      EventType.Leave
    );
    eventFour = new EventModel(
      'Event Four',
      '',
      moment('2017-11-30'),
      moment('2017-12-25'),
      1,
      EventType.TDY_DEPLOYMENT
    );

    const eventList = [eventOne, eventTwo, eventThree, eventFour];

    trackerStore = new TrackerStore(DoubleRepositories);
    trackerStore.setSelectedAirman(airman);

    availabilityStore = new AvailabilityStore(DoubleRepositories);
    availabilityStore.setAirmanEvents(eventList);

    plannerStore = new PlannerStore(new TimeServiceStub());

    subject = shallow(
      <Availability
        trackerStore={trackerStore}
        availabilityStore={availabilityStore}
        plannerStore={plannerStore}
        availabilityActions={availabilityActions}
      />
    );
  });

  it('renders the availability for an airman', () => {
    expect(subject.text()).toContain('26 NOV - 02 DEC');
    expect(subject.text()).toContain('SUN, 26 NOV 17');
    expect(subject.text()).toContain('MON, 27 NOV 17');
    expect(subject.text()).toContain('TUE, 28 NOV 17');
    expect(subject.text()).toContain('WED, 29 NOV 17');
    expect(subject.text()).toContain('THU, 30 NOV 17');
    expect(subject.text()).toContain('FRI, 01 DEC 17');
    expect(subject.text()).toContain('SAT, 02 DEC 17');
  });

  it('renders Add Events buttons for each date', () => {
    let index: number;
    for (index = 0; index < 7; index++) {
      const dateWrapper = subject.find('#day-' + index);
      expect(dateWrapper.find('.add-event-on-date').exists()).toBeTruthy();
      expect(dateWrapper.find('.add-event-on-date').text()).toBe('+ Add Event');
    }
  });

  it('calls the createEvent on date click', () => {
    subject.find('.event-date').at(0).simulate('click');
    expect(availabilityActions.openEventFormForDay).toHaveBeenCalledWith(moment('2017-11-26'));
  });

  it('renders a list of events', () => {
    expect(subject.find(StyledAvailabilityTile).length).toBe(9);
  });

  it('renders all the scheduled events for the given day', () => {
    const dateWrapper = subject.find('#day-1');
    expect(dateWrapper.find(StyledAvailabilityTile).length).toBe(3);
    expect(dateWrapper.find('.event-date').text()).toContain('MON, 27 NOV 17');
  });

  it('renders an Add Event button', () => {
    expect(subject.find('button.add-event').exists()).toBeTruthy();
    expect(subject.find('button.add-event').text()).toBe('+ Add Event');
  });

  it('forwards availability to next week', () => {
    subject.find('button.next-week').simulate('click');
    expect(availabilityActions.incrementWeek).toHaveBeenCalled();
  });

  it('advanced to previous weeks', () => {
    subject.find('button.last-week').simulate('click');
    expect(availabilityActions.decrementWeek).toHaveBeenCalled();
  });

  it('renders event type radio buttons form after calling show event form', () => {
    availabilityStore.showEventForm();
    subject.update();
    expect(subject.find(StyledRadioButtons).exists()).toBeTruthy();
  });

  describe('create new event form', () => {
    beforeEach(() => {
      availabilityStore.showEventForm();
    });

    it('shows an appointment form', () => {
      availabilityStore.setEventFormType(EventType.Appointment);
      subject.update();

      expect(subject.find(StyledRadioButtons).prop('value')).toBe(EventType.Appointment);
      expect(subject.find(StyledAppointmentForm).exists()).toBeTruthy();
    });

    it('shows a leave form', () => {
      availabilityStore.setEventFormType(EventType.Leave);
      subject.update();

      expect(subject.find(StyledRadioButtons).prop('value')).toBe(EventType.Leave);
      expect(subject.find(StyledLeaveForm).exists()).toBeTruthy();
    });

    it('shows a tdy/deployment form', () => {
      availabilityStore.setEventFormType(EventType.TDY_DEPLOYMENT);
      subject.update();

      expect(subject.find(StyledRadioButtons).prop('value')).toBe(EventType.TDY_DEPLOYMENT);
      expect(subject.find(StyledTDYDeploymentForm).exists()).toBeTruthy();
    });
  });

  describe('edit event form', () => {
    let event: EventModel;

    beforeEach(() => {
      event = EventModelFactory.build();
    });

    it('shows an appointment form', () => {
      event.type = EventType.Appointment;
      availabilityStore.openEditEventForm(event);
      subject.update();

      expect(subject.find(StyledRadioButtons).exists()).toBeFalsy();
      expect(subject.find(StyledAppointmentForm).exists()).toBeTruthy();
    });

    it('shows a leave form', () => {
      event.type = EventType.Leave;
      availabilityStore.openEditEventForm(event);
      subject.update();

      expect(subject.find(StyledRadioButtons).exists()).toBeFalsy();
      expect(subject.find(StyledLeaveForm).exists()).toBeTruthy();
    });

    it('shows a tdy/deployment form', () => {
      event.type = EventType.TDY_DEPLOYMENT;
      availabilityStore.openEditEventForm(event);
      subject.update();

      expect(subject.find(StyledRadioButtons).exists()).toBeFalsy();
      expect(subject.find(StyledTDYDeploymentForm).exists()).toBeTruthy();
    });
  });
});