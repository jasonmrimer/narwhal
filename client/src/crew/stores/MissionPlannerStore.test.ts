import { MissionPlannerStore } from './MissionPlannerStore';
import { CrewModelFactory } from '../factories/CrewModelFactory';
import { AirmanModelFactory } from '../../airman/factories/AirmanModelFactory';
import { EventModelFactory } from '../../event/factories/EventModelFactory';
import { DoubleRepositories } from '../../utils/Repositories';

describe('MissionPlannerStore', () => {
  let subject: MissionPlannerStore;

  beforeEach(() => {
    const crew = CrewModelFactory.build(1);
    const airmen = [AirmanModelFactory.build(1), AirmanModelFactory.build(2)];
    const events = [EventModelFactory.build()];

    subject = new MissionPlannerStore(DoubleRepositories);
    subject.hydrate(crew.mission, airmen, events);
  });

  it('should return available airmen', () => {
    expect(subject.availableAirmen.length).toEqual(1);
    const airmenIds = subject.availableAirmen.map(airman => airman.id);
    expect(airmenIds[0]).toBe(2);
  });

  it('should return unavailable airmen', () => {
    expect(subject.unavailableAirmen.length).toEqual(1);
    const airmenIds = subject.unavailableAirmen.map(airman => airman.id);
    expect(airmenIds[0]).toBe(1);
  });

});
