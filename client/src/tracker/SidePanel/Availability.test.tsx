import * as React from 'react';
import { shallow } from 'enzyme';
import PlannerServiceStub from '../services/doubles/PlannerServiceStub';
import { Availability } from './Availability';
import AirmanEvent from '../../airman/AirmanEvent';
import EventModel from '../../event/EventModel';
import * as moment from 'moment';

describe('Availability', () => {
  const event = new EventModel(1, 'Event', '', moment('2017-11-27T05:00:00.000Z'), moment('2017-11-27T10:00:00.000Z'));
  const week = new PlannerServiceStub().getCurrentWeek();
  const subject = shallow(<Availability week={week} events={[event]}/>);

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
    expect(subject.find(AirmanEvent).length).toBe(1);
  });

  it('renders the scheduled event for the given day', () => {
    const dateWrapper = subject.findWhere((s) => s.key() === 'day-1');
    expect(dateWrapper.find(AirmanEvent).exists()).toBeTruthy();
    expect(dateWrapper.find('.event_date').text()).toContain('MON, 27 NOV 17');
  });
});