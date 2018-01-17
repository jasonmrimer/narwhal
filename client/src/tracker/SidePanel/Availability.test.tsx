import * as React from 'react';
import { shallow } from 'enzyme';
import PlannerServiceStub from '../services/doubles/PlannerServiceStub';
import { Availability } from './Availability';
import AirmanEvent from '../../airman/AirmanEvent';
import EventModel from '../../event/EventModel';
import * as moment from 'moment';
import EventForm from './EventForm';
import AirmanModelFactory from '../../airman/factories/AirmanModelFactory';

describe('Availability', () => {
  const airman = AirmanModelFactory.build();
  const eventOne = new EventModel(
    'Event One',
    '',
    moment('2017-11-27T05:00:00.000Z'),
    moment('2017-11-27T10:00:00.000Z'),
    1
  );
  const eventTwo = new EventModel(
    'Event Two',
    '',
    moment('2017-11-27T12:00:00.000Z'),
    moment('2017-11-27T15:00:00.000Z'),
    1
  );
  airman.events = [eventOne, eventTwo];
  const week = new PlannerServiceStub().getCurrentWeek();

  /*tslint:disable:no-empty*/
  const subject = shallow(
    <Availability
      week={week}
      airman={airman}
      submitEvent={() => {
      }}
    />
  );

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
    expect(subject.find(AirmanEvent).length).toBe(airman.events.length);
  });

  it('renders all the scheduled events for the given day', () => {
    const dateWrapper = subject.findWhere((s) => s.key() === 'day-1');
    expect(dateWrapper.find(AirmanEvent).length).toBe(2);
    expect(dateWrapper.find('.event-date').text()).toContain('MON, 27 NOV 17');
  });

  it('renders an Add Event button', () => {
    expect(subject.find('button').exists()).toBeTruthy();
    expect(subject.find('button').text()).toBe('+ Add Event');
  });

  it('opens a New Event form after clicking Add Event', () => {
    subject.find('button').simulate('click');
    expect(subject.find(EventForm).exists()).toBeTruthy();
  });
});