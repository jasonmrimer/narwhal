import * as React from 'react';
import {PlannerEvent} from './PlannerEvent';
import * as moment from 'moment';
import {shallow, ShallowWrapper} from 'enzyme';
import {AvailableIcon} from '../icons/AvailableIcon';
import {OffDayIcon} from '../icons/OffDayIcon';
import {LeaveIcon} from '../icons/LeaveIcon';
import {EventType} from '../event/models/EventModel';
import {EventModelFactory} from '../event/factories/EventModelFactory';
import {AppointmentIcon} from '../icons/AppointmentIcon';
import {TDYDeploymentIcon} from '../icons/TDYDeploymentIcon';
import {MissionIcon} from '../icons/MissionIcon';

describe('PlannerEvent', () => {
  const event = EventModelFactory.build();
  const day = moment(0);
  const airman: any = {
    isAvailableForWork: () => true
  };
  const trackerStore: any = {
    getDailyEventsByAirmanId: () => []
  };
  let subject: ShallowWrapper;

  beforeEach(() => {
    subject = shallow(
      <PlannerEvent
        airman={airman}
        day={day}
        trackerStore={trackerStore}
      />
    );
  });

  it('renders the available icon', () => {
    expect(subject.find(AvailableIcon).exists()).toBeTruthy();
  });

  it('renders the off day icon', () => {
    airman.isAvailableForWork = () => false;

    subject.instance().forceUpdate();
    subject.update();

    expect(subject.find(OffDayIcon).exists()).toBeTruthy();
  });

  it('renders all types of events', () => {
    [
      [EventType.Leave, LeaveIcon],
      [EventType.Appointment, AppointmentIcon],
      [EventType.TDY_DEPLOYMENT, TDYDeploymentIcon],
      [EventType.Mission, MissionIcon]
    ].forEach(item => {
      event.type = item[0] as any;
      trackerStore.getDailyEventsByAirmanId = () => [event];

      subject.instance().forceUpdate();
      subject.update();

      expect(subject.find(item[1] as any).exists()).toBeTruthy();
    });
  });
});