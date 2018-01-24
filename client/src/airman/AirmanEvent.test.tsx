import EventModel, { EventType } from '../event/EventModel';
import * as moment from 'moment';
import { shallow, ShallowWrapper } from 'enzyme';
import * as React from 'react';
import { AirmanEvent } from './AirmanEvent';
import { eventStub } from '../utils/testUtils';

describe('AirmanEvent', () => {
  let subject: ShallowWrapper;
  const deleteEventSpy = jest.fn();
  const editEventSpy = jest.fn();
  const startTime = moment('2017-11-22T08:00:00.000Z').utc();
  const endTime = moment('2017-11-22T09:00:00.000Z').utc();
  const event = new EventModel('Dentist', '', startTime, endTime, 1, EventType.Mission, 1);

  beforeEach(() => {
    subject = shallow(<AirmanEvent event={event} deleteEvent={deleteEventSpy} editEvent={editEventSpy}/>);
  });

  it('renders the event attributes', () => {
    expect(subject.text()).toContain('Dentist');
    expect(subject.text()).toContain('0800Z - 0900Z');
    expect(subject.text()).toContain('22 NOV 17');
  });

  it('has an actionable delete button', () => {
    subject.find('button').simulate('click', eventStub);
    expect(deleteEventSpy).toHaveBeenCalledWith(event);
  });

  it('calls an editEvent callback on click', () => {
    subject.simulate('click');
    expect(editEventSpy).toHaveBeenCalledWith(event);
  });
});