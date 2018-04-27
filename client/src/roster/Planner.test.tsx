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
import { eventStub, makeFakeTrackerStore } from '../utils/testUtils';
import { TrackerStore } from '../tracker/stores/TrackerStore';
import { AirmanModel } from '../airman/models/AirmanModel';
import { EventModel, EventType } from '../event/models/EventModel';
import { DoubleRepositories } from '../utils/Repositories';
import { ScheduleModel } from '../schedule/models/ScheduleModel';
import { OffDayIcon } from '../icons/OffDayIcon';
import { AirmanScheduleModel } from '../airman/models/AirmanScheduleModel';

describe('Planner', () => {
  let subject: ShallowWrapper;
  let trackerStore: TrackerStore;
  let airman: AirmanModel;
  beforeEach(async () => {
    airman = AirmanModelFactory.build();
    airman.schedules = [
      new AirmanScheduleModel(
        1,
        airman.id,
        new
        ScheduleModel(
          1,
          'Back Half',
          false,
          false,
          false,
          true,
          true,
          true,
          true),
        moment('2017-11-26').subtract(3, 'months'),
        moment('2017-11-26').add(1, 'day')
      ),
      new AirmanScheduleModel(
        1,
        airman.id,
        new
        ScheduleModel(
          1,
          'M-F',
          false,
          true,
          true,
          true,
          true,
          true,
          false),
        moment('2017-11-26'),
        null
      )
    ];

    const appointment = new EventModel(
      'Appointment',
      '',
      moment('2017-11-29'),
      moment('2017-11-29'),
      1,
      EventType.Appointment
    );
    const mission = new EventModel(
      'ABC',
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

  let newEventSpy = jest.fn();

  it('renders airmen high-level availability', () => {
    expect(subject.find(AppointmentIcon).length).toBe(1);
    expect(subject.find(MissionIcon).length).toBe(1);
    expect(subject.find(MissionIcon).prop('title')).toBe('ABC');
    expect(subject.find(LeaveIcon).length).toBe(2);
    expect(subject.find(AvailableIcon).length).toBe(1);
    expect(subject.find(OffDayIcon).length).toBe(2);
  });

  it('give higher importance to mission Event Type than the others', () => {
    expect(subject.find(MissionIcon).length).toBe(1);
  });

  it('calls the newEvent when clicking on an empty bubble', () => {
    const emptyBubble = subject.find(AvailableIcon).at(0);
    emptyBubble.simulate('click', eventStub);

    const calledMoment = (newEventSpy.mock.calls[0][1]).startOf('day');
    const expectedMoment = moment('2017-12-01').startOf('day');

    expect(calledMoment.isSame(expectedMoment)).toBeTruthy();
    expect(newEventSpy.mock.calls[0][0]).toEqual(airman);
  });
});