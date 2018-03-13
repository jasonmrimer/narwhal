import * as React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import { Planner } from './Planner';
import * as moment from 'moment';
import { AppointmentIcon } from '../icons/AppointmentIcon';
import { LeaveIcon } from '../icons/LeaveIcon';
import { MissionIcon } from '../icons/MissionIcon';
import { AvailableIcon } from '../icons/AvailableIcon';
import { TimeServiceStub } from '../tracker/services/doubles/TimeServiceStub';
import { EventModel, EventType } from '../event/models/EventModel';
import { AirmanModelFactory } from '../airman/factories/AirmanModelFactory';
import { makeFakeTrackerStore } from '../utils/testUtils';
import { TrackerStore } from '../tracker/stores/TrackerStore';
import { AirmanModel } from '../airman/models/AirmanModel';

describe('Planner', () => {
  let subject: ShallowWrapper;
  let trackerStore: TrackerStore;
  let airman: AirmanModel;
  let newEventSpy = jest.fn();

  beforeEach(async () => {
    const appointment = new EventModel(
      'Appointment',
      '',
      moment('2017-11-26T05:00:00.000Z'),
      moment('2017-11-26T06:00:00.000Z'),
      1,
      EventType.Appointment,
      1
    );

    const mission = new EventModel(
      'Mission',
      '',
      moment('2017-11-27T05:00:00.000Z'),
      moment('2017-11-28T06:00:00.000Z'),
      1,
      EventType.Mission,
      2
    );

    const leave = new EventModel(
      'Leave',
      '',
      moment('2017-11-27T05:00:00.000Z'),
      moment('2017-11-30T05:00:00.000Z'),
      1,
      EventType.Leave,
      3
    );

    airman = AirmanModelFactory.build();
    airman.events = [
      appointment,
      leave,
      mission,
    ];

    const week = new TimeServiceStub().getCurrentWeek();
    trackerStore = await makeFakeTrackerStore();
    trackerStore.newEvent = newEventSpy;
    subject = shallow(
      <Planner
        airman={airman}
        week={week}
        trackerStore={trackerStore}
      />);
  });

  it('renders airmen high-level availability', () => {
    expect(subject.find(AppointmentIcon).length).toBe(1);
    expect(subject.find(MissionIcon).length).toBe(1);
    expect(subject.find(LeaveIcon).length).toBe(3);
    expect(subject.find(AvailableIcon).length).toBe(2);
  });

  it('give higher importance to mission Event Type than the others', () => {
    expect(subject.find(MissionIcon).length).toBe(1);
  });

  it('calls the newEvent when clicking on an empty bubble', () => {
    const emptyBubble = subject.find(AvailableIcon).at(0);
    emptyBubble.simulate('click');
    expect(newEventSpy.mock.calls[0][1].isSame(moment.utc('2017-12-01T05:00:00.000Z'))).toBeTruthy();
    expect(newEventSpy.mock.calls[0][0]).toEqual(airman);
  });
});