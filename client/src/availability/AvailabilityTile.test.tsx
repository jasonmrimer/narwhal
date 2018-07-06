import { EventModel, EventStatus, EventType } from '../event/models/EventModel';
import * as moment from 'moment';
import { shallow, ShallowWrapper } from 'enzyme';
import * as React from 'react';
import { AvailabilityTile } from './AvailabilityTile';
import { Link } from 'react-router-dom';
import { makeFakeProfile } from '../utils/testUtils';
import { readerAbility, writerAbility } from '../app/abilities';

describe('AvailabilityTile', () => {
  let subject: ShallowWrapper;
  const editEventSpy = jest.fn();
  const startTime = moment('2017-11-22');
  const endTime = moment('2017-11-22');
  let event: EventModel;

  beforeEach(() => {
    event = new EventModel(
      'XYZTEST-MISSION-1',
      '',
      startTime,
      endTime,
      1,
      EventType.Mission,
      1,
      EventStatus.Pending,
    );

    subject = shallow(
        <AvailabilityTile
          event={event}
          editEvent={editEventSpy}
          profile={makeFakeProfile('WRITER', writerAbility)}
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
    expect(subject.find(Link).prop('to')).toBe(`/dashboard/crew/${event.id}`);
  });

  it('should render a pending event status', () => {
    expect(subject.text()).toContain('[PENDING]');
  });

  it('should render a denied event status', () => {
    event.status = EventStatus.Denied;

    subject = shallow(
      <AvailabilityTile
        event={event}
        editEvent={editEventSpy}
        profile={makeFakeProfile('WRITER', writerAbility)}
      />
    );

    expect(subject.text()).toContain('[DENIED]');
  });

  it('should not render sweet nocs when profile is reader', () => {
    subject = shallow(
      <AvailabilityTile
        event={event}
        editEvent={editEventSpy}
        profile={makeFakeProfile('READER', readerAbility)}
      />
    );

    expect(subject.find(Link).exists()).toBeFalsy();
  });
});