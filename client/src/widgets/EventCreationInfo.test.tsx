import { shallow, ShallowWrapper } from 'enzyme';
import { EventModel, EventType } from '../event/models/EventModel';
import * as moment from 'moment';
import { Moment } from 'moment';
import { EventCreationInfo } from './EventCreationInfo';
import * as React from 'react';

describe('EventCreationInfo', () => {
  let subject: ShallowWrapper;
  let event: EventModel;
  let time: Moment;

  beforeEach(() => {
    time = moment();
    event = new EventModel('test', '', moment(), moment(), 123, EventType.Leave, null, 'user', time);

    subject = shallow(
      <EventCreationInfo event={event}/>
    );
  });

  it('should render the user name information and the date it was created on.', () => {
    expect(subject.text()).toContain('user');
    expect(subject.text()).toContain(time.format('D MMM YY'));
    expect(subject.text()).toContain(time.format('HHmm'));
  });
});