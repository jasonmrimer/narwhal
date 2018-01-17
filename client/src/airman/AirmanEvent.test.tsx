import EventModel from '../event/EventModel';
import * as moment from 'moment';
import { shallow } from 'enzyme';
import * as React from 'react';
import { AirmanEvent } from './AirmanEvent';

describe('AirmanEvent', () => {
  it('renders the event attributes', () => {
    const startTime = moment('2017-11-22T08:00:00.000Z').utc();
    const endTime = moment('2017-11-22T09:00:00.000Z').utc();
    const event = new EventModel('Dentist', '', startTime, endTime, 1);
    const subject = shallow(<AirmanEvent event={event}/>);

    expect(subject.text()).toContain('Dentist');
    expect(subject.text()).toContain('0800Z - 0900Z');
    expect(subject.text()).toContain('22 NOV 17');
  });
});