import { MissionPlannerStore } from './MissionPlannerStore';
import { CrewModelFactory } from '../factories/CrewModelFactory';
import { AirmanModelFactory } from '../../airman/factories/AirmanModelFactory';
import { EventModelFactory } from '../../event/factories/EventModelFactory';
import { DoubleRepositories } from '../../utils/Repositories';
import { AirmanScheduleModel } from '../../airman/models/AirmanScheduleModel';
import { ScheduleModel, ScheduleType } from '../../schedule/models/ScheduleModel';
import * as moment from 'moment';

describe('MissionPlannerStore', () => {
  let subject: MissionPlannerStore;

  beforeEach(() => {
    const crew = CrewModelFactory.build(1);
    const airmen = [AirmanModelFactory.build(1), AirmanModelFactory.build(2), AirmanModelFactory.build(3)];
    const events = [EventModelFactory.build()];

    crew.mission.startDateTime = moment('2018-07-10 0400', 'YYYY-MM-DD HHmm');

    airmen[0].schedules.push(
      new AirmanScheduleModel(
        airmen[0].id,
        new ScheduleModel(1, ScheduleType.MondayToFriday, false, true, true, true, true, true, false),
        crew.mission.startDateTime.clone().subtract(15, 'days'),
      )
    )

    airmen[1].schedules.push(
      new AirmanScheduleModel(
        airmen[1].id,
        new ScheduleModel(1, ScheduleType.MondayToFriday, false, true, true, true, true, true, false),
        crew.mission.startDateTime.clone().subtract(15, 'days'),
      )
    )

    airmen[2].schedules.push(
      new AirmanScheduleModel(
        airmen[2].id,
        new ScheduleModel(2, ScheduleType.BackHalf, false, false, false, true, true, true, true),
        crew.mission.startDateTime.clone().subtract(15, 'days'),
      )
    )
    subject = new MissionPlannerStore(DoubleRepositories);
    subject.hydrate(crew.mission, airmen, events);
  });

  it('should return available airmen', () => {
    expect(subject.availableAirmen.length).toEqual(1);
    const airmenIds = subject.availableAirmen.map(airman => airman.id);
    expect(airmenIds[0]).toBe(2);
  });

  it('should return unavailable airmen', () => {
    expect(subject.unavailableAirmen.length).toEqual(2);
    const airmenIds = subject.unavailableAirmen.map(airman => airman.id);
    expect(airmenIds.map(airmenId => airmenId)).toContain(1);
    expect(airmenIds.map(airmenId => airmenId)).toContain(3);
  });

});
