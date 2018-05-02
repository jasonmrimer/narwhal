import * as React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import { Planner } from './Planner';
import * as moment from 'moment';
import { AppointmentIcon } from '../icons/AppointmentIcon';
import { LeaveIcon } from '../icons/LeaveIcon';
import { MissionIcon } from '../icons/MissionIcon';
import { AvailableIcon } from '../icons/AvailableIcon';
import { AirmanModelFactory } from '../airman/factories/AirmanModelFactory';
import { eventStub } from '../utils/testUtils';
import { TrackerStore } from '../tracker/stores/TrackerStore';
import { AirmanModel } from '../airman/models/AirmanModel';
import { EventModel, EventType } from '../event/models/EventModel';
import { DoubleRepositories } from '../utils/Repositories';
import { AvailabilityStore } from '../availability/stores/AvailabilityStore';
import { PlannerStore } from './stores/PlannerStore';
import { TimeServiceStub } from '../tracker/services/doubles/TimeServiceStub';
import { PlannerActions } from './PlannerActions';
import { ScheduleModel, ScheduleType } from '../schedule/models/ScheduleModel';
import { OffDayIcon } from '../icons/OffDayIcon';
import { AirmanScheduleModel } from '../airman/models/AirmanScheduleModel';

describe('Planner', () => {
  let subject: ShallowWrapper;
  let trackerStore: TrackerStore;
  let plannerStore: PlannerStore;
  let availabilityStore: AvailabilityStore;
  let airman: AirmanModel;

  beforeEach(async () => {
    airman = AirmanModelFactory.build();
    airman.schedules = [
      new AirmanScheduleModel(
        airman.id,
        new
        ScheduleModel(
          2,
          ScheduleType.BackHalf,
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
        airman.id,
        new
        ScheduleModel(
          1,
          ScheduleType.MondayToFriday,
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

    PlannerActions.openSidePanel = jest.fn();

    trackerStore = new TrackerStore(DoubleRepositories);
    trackerStore.hydrate([airman], [appointment, mission, leave], airman.siteId);
    plannerStore = new PlannerStore(new TimeServiceStub());
    availabilityStore = new AvailabilityStore(DoubleRepositories);

    subject = shallow(
      <Planner
        airman={airman}
        trackerStore={trackerStore}
        plannerStore={plannerStore}
        availabilityStore={availabilityStore}
      />);
  });

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

  it('calls the openSidePanel when clicking on an empty bubble', () => {
    const emptyBubble = subject.find(AvailableIcon).at(0);
    emptyBubble.simulate('click', eventStub);
    expect(PlannerActions.openSidePanel).toHaveBeenCalled();
  });
});