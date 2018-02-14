import { EventModel, EventType } from '../event/models/EventModel';
import * as moment from 'moment';
import { shallow, ShallowWrapper } from 'enzyme';
import * as React from 'react';
import { AvailabilityTile } from './AvailabilityTile';

describe('AvailabilityTile', () => {
  let subject: ShallowWrapper;
  const editEventSpy = jest.fn();
  const startTime = moment('2017-11-22T08:00:00.000Z').utc();
  const endTime = moment('2017-11-22T09:00:00.000Z').utc();
  const event = new EventModel('Dentist', '', startTime, endTime, 1, EventType.Mission, 1);

  beforeEach(() => {
    subject = shallow(<AvailabilityTile event={event} editEvent={editEventSpy}/>);
  });

  it('renders the event attributes', () => {
    expect(subject.text()).toContain('Dentist');
    expect(subject.text()).toContain('0800Z - 0900Z');
  });

  it('calls an editEvent callback on click', () => {
    subject.simulate('click');
    expect(editEventSpy).toHaveBeenCalledWith(event);
  });
});