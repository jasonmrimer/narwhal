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

describe('Planner', () => {
  let subject: ShallowWrapper;
  let trackerStore: TrackerStore;
  let plannerStore: PlannerStore;
  let availabilityStore: AvailabilityStore;
  let airman: AirmanModel;

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

    airman = AirmanModelFactory.build();

    await DoubleRepositories.eventRepository.save(appointment);
    await DoubleRepositories.eventRepository.save(leave);
    await DoubleRepositories.eventRepository.save(mission);

    PlannerActions.newEvent = jest.fn();

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
    expect(subject.find(AvailableIcon).length).toBe(3);
  });

  it('give higher importance to mission Event Type than the others', () => {
    expect(subject.find(MissionIcon).length).toBe(1);
  });

  it('calls the newEvent when clicking on an empty bubble', () => {
    const emptyBubble = subject.find(AvailableIcon).at(0);
    emptyBubble.simulate('click', eventStub);
    expect(PlannerActions.newEvent).toHaveBeenCalled();
  });
});