import { EventModel, EventType } from '../event/models/EventModel';
import * as moment from 'moment';
import { shallow, ShallowWrapper } from 'enzyme';
import * as React from 'react';
import { AvailabilityTile } from './AvailabilityTile';
import { Link } from 'react-router-dom';

describe('AvailabilityTile', () => {
  let subject: ShallowWrapper;
  const editEventSpy = jest.fn();
  const startTime = moment('2017-11-22');
  const endTime = moment('2017-11-22');
  const event = new EventModel('XYZTEST-MISSION-1', '', startTime, endTime, 1, EventType.Mission, 1);

  beforeEach(() => {
    subject = shallow(
        <AvailabilityTile
          event={event}
          editEvent={editEventSpy}
        />
    );
  });

  it('renders the event attributes', () => {
    expect(subject.text()).toContain('XYZTEST-MISSION-1');
  });

  it('calls an editEvent callback on click', () => {
    subject.simulate('click');
    expect(editEventSpy).toHaveBeenCalledWith(event);
  });

  it('renders a button that links to the missions crew if the event is a mission', () => {
    expect(subject.find(Link).exists()).toBeTruthy();
    expect(subject.find(Link).prop('to')).toBe(`/crew/${event.id}`);
  });
});