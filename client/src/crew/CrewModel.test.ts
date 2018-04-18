import { CrewModel } from './models/CrewModel';
import { MissionModelFactory } from '../mission/factories/MissionModelFactory';
import { CrewPositionModel } from './models/CrewPositionModel';
import { AirmanModelFactory } from '../airman/factories/AirmanModelFactory';

describe('CrewModel', () => {
  it('should return the crew status', () => {
    const crew = new CrewModel(
      1,
      MissionModelFactory.build(),
      [new CrewPositionModel(AirmanModelFactory.build(1), '', false)]
    );
    expect(crew.hasCrewPositions).toBeTruthy();
  });
});
