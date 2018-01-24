import * as React from 'react';
import { mount, ReactWrapper } from 'enzyme';
import { Availability } from './Availability';
import { AirmanEvent } from '../../airman/AirmanEvent';
import EventModel, { EventType } from '../../event/EventModel';
import * as moment from 'moment';
import StyledEventForm, { EventForm } from './EventForm';
import AirmanModelFactory from '../../airman/factories/AirmanModelFactory';
import { makeFakeTrackerStore } from '../../utils/testUtils';
import TrackerStore from '../stores/TrackerStore';
import AirmanModel from '../../airman/models/AirmanModel';

let trackerStore: TrackerStore;
let airman: AirmanModel;
let subject: ReactWrapper;
let eventOne: EventModel;
let eventTwo: EventModel;

describe('Availability', () => {
  beforeEach(async () => {
    airman = AirmanModelFactory.build();
    eventOne = new EventModel(
      'Event One',
      '',
      moment('2017-11-27T05:00:00.000Z'),
      moment('2017-11-27T10:00:00.000Z'),
      1,
      EventType.Mission
    );
    eventTwo = new EventModel(
      'Event Two',
      '',
      moment('2017-11-27T12:00:00.000Z'),
      moment('2017-11-27T15:00:00.000Z'),
      1,
      EventType.Mission
    );
    airman.events = [eventOne, eventTwo];

    trackerStore = await makeFakeTrackerStore();
    trackerStore.setSelectedAirman(airman);

    subject = mount(<Availability trackerStore={trackerStore}/>);
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
    expect(subject.find(AirmanEvent).length).toBe(2);
  });

  it('renders all the scheduled events for the given day', () => {
    const dateWrapper = subject.find('#day-1');
    expect(dateWrapper.find(AirmanEvent).length).toBe(2);
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

  it('opens an Edit Event form when clicking on an existing Event Card', () => {
    subject.find(AirmanEvent).at(0).simulate('click');
    expect(subject.find(StyledEventForm).prop('event')).toEqual(eventOne);
  });

  it('can exit out of an event form', () => {
    subject.find('button.add-event').simulate('click');
    subject.find(EventForm).find('a.back').simulate('click');
    subject.update();
    expect(subject.state('showEventForm')).toBeFalsy();
    expect(subject.find(StyledEventForm).exists()).toBeFalsy();
  });

  it('closes the event form when event is cleared', () => {
    subject.find('button.add-event').simulate('click');
    trackerStore.clearSelectedEvent();
    subject.setProps({trackerStore: trackerStore});
    expect(subject.state('showEventForm')).toBeFalsy();
  });
});