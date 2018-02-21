import * as React from 'react';
import * as moment from 'moment';
import { Availability } from './Availability';
import { EventModel, EventType } from '../event/models/EventModel';
import { AirmanModel } from '../airman/models/AirmanModel';
import { AirmanModelFactory } from '../airman/factories/AirmanModelFactory';
import { StyledEventForm } from '../event/EventForm';
import { StyledAvailabilityTile } from './AvailabilityTile';
import { TrackerStore } from '../tracker/stores/TrackerStore';
import { makeFakeTrackerStore } from '../utils/testUtils';
import { shallow, ShallowWrapper } from 'enzyme';

let trackerStore: TrackerStore;
let airman: AirmanModel;
let subject: ShallowWrapper;
let eventOne: EventModel;
let eventTwo: EventModel;
let eventThree: EventModel;

describe('Availability', () => {
  beforeEach(async () => {
    airman = AirmanModelFactory.build();
    eventOne = new EventModel(
      'Event One',
      '',
      moment('2017-11-27'),
      moment('2017-11-27'),
      1,
      EventType.Mission
    );
    eventTwo = new EventModel(
      'Event Two',
      '',
      moment('2017-11-27'),
      moment('2017-11-27'),
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

    airman.events = [eventOne, eventTwo, eventThree];

    trackerStore = await makeFakeTrackerStore();
    trackerStore.setSelectedAirman(airman);

    subject = shallow(<Availability trackerStore={trackerStore}/>);
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

  it('renders a list of events', () => {
    expect(subject.find(StyledAvailabilityTile).length).toBe(6);
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

  it('opens a New Event form after clicking Add Event', () => {
    subject.find('button.add-event').simulate('click');
    expect(subject.find(StyledEventForm).exists()).toBeTruthy();
  });

  it('forwards availability to next week', () => {
    subject.find('button.next-week').simulate('click');
    expect(subject.text()).toContain('03 DEC - 09 DEC');
    const dateWrapper = subject.find('#day-1');
    expect(dateWrapper.find('.event-date').text()).toContain('MON, 04 DEC 17');
  });

  it('advanced to previous weeks', () => {
    subject.find('button.last-week').simulate('click');
    expect(subject.text()).toContain('19 NOV - 25 NOV');
    const dateWrapper = subject.find('#day-1');
    expect(dateWrapper.find('.event-date').text()).toContain('MON, 20 NOV 17');
  });

  it('opens an Edit Event form when clicking on an existing Event Card', () => {
    (subject.instance() as Availability).openEventFormForEdit(eventOne);
    subject.update();
    expect(subject.find(StyledEventForm).prop('event')).toEqual(eventOne);
  });

  it('can exit out of an event form', () => {
    subject.find('button.add-event').simulate('click');
    expect(trackerStore.availabilityStore.showEventForm).toBeTruthy();
    (subject.instance() as Availability).closeEventForm();
    subject.update();
    expect(trackerStore.availabilityStore.showEventForm).toBeFalsy();
    expect(subject.find(StyledEventForm).exists()).toBeFalsy();
  });
});