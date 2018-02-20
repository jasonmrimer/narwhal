import { CrewModel } from '../models/CrewModel';
import { MissionModelFactory } from '../../mission/factories/MissionModelFactory';
import { AirmanModelFactory } from '../../airman/factories/AirmanModelFactory';
import { CrewPositionModel } from '../models/CrewPositionModel';

export class CrewModelFactory {
    static crewPositions = [
      new CrewPositionModel(1, AirmanModelFactory.build(1)),
      new CrewPositionModel(2, AirmanModelFactory.build(2))
    ];

  static build(id: number = 1) {
    return new CrewModel(
      id,
      MissionModelFactory.build(),
      CrewModelFactory.crewPositions
    );
  }
}