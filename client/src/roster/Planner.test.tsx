import * as React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import { Planner } from './Planner';
import * as moment from 'moment';
import { AppointmentIcon } from '../icons/AppointmentIcon';
import { LeaveIcon } from '../icons/LeaveIcon';
import { MissionIcon } from '../icons/MissionIcon';
import { AvailableIcon } from '../icons/AvailableIcon';
import { TimeServiceStub } from '../tracker/services/doubles/TimeServiceStub';
import { AirmanModelFactory } from '../airman/factories/AirmanModelFactory';
import { makeFakeTrackerStore } from '../utils/testUtils';
import { TrackerStore } from '../tracker/stores/TrackerStore';
import { AirmanModel } from '../airman/models/AirmanModel';
import { EventModel, EventType } from '../event/models/EventModel';
import { DoubleRepositories } from '../Repositories';

describe('Planner', () => {
  let subject: ShallowWrapper;
  let trackerStore: TrackerStore;
  let airman: AirmanModel;
  let newEventSpy = jest.fn();

  beforeEach(async () => {
    const appointment = new EventModel(
      'Appointment',
      '',
      moment('2017-11-29'),
      moment('2017-11-29'),
      1,
      EventType.Appointment
    );

    const mission = new EventModel(
      'Mission',
      '',
      moment('2017-11-27'),
      moment('2017-11-28'),
      1,
      EventType.Mission
    );

    const leave = new EventModel(
      'Leave',
      '',
      moment('2017-11-27'),
      moment('2017-11-30'),
      1,
      EventType.Leave
    );

    airman = AirmanModelFactory.build();

    await DoubleRepositories.eventRepository.save(appointment);
    await DoubleRepositories.eventRepository.save(leave);
    await DoubleRepositories.eventRepository.save(mission);

    trackerStore = await makeFakeTrackerStore();
    trackerStore.newEvent = newEventSpy;

    subject = shallow(
      <Planner
        airman={airman}
        week={new TimeServiceStub().getCurrentWeek()}
        trackerStore={trackerStore}
      />);
  });

  it('renders airmen high-level availability', () => {
    expect(subject.find(AppointmentIcon).length).toBe(1);
    expect(subject.find(MissionIcon).length).toBe(1);
    expect(subject.find(LeaveIcon).length).toBe(2);
    expect(subject.find(AvailableIcon).length).toBe(3);
  });

  it('give higher importance to mission Event Type than the others', () => {
    expect(subject.find(MissionIcon).length).toBe(1);
  });

  it('calls the newEvent when clicking on an empty bubble', () => {
    const emptyBubble = subject.find(AvailableIcon).at(0);
    emptyBubble.simulate('click');

    const calledMoment = (newEventSpy.mock.calls[0][1]).startOf('day');
    const expectedMoment = moment('2017-11-26').startOf('day');

    expect(calledMoment.isSame(expectedMoment)).toBeTruthy();
    expect(newEventSpy.mock.calls[0][0]).toEqual(airman);
  });
});