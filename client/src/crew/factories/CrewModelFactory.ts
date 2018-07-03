import { CrewModel } from '../models/CrewModel';
import { MissionModelFactory } from '../../mission/factories/MissionModelFactory';
import { AirmanModelFactory } from '../../airman/factories/AirmanModelFactory';
import { CrewPositionModel } from '../models/CrewPositionModel';

export class CrewModelFactory {
    static crewPositions = [
      new CrewPositionModel(AirmanModelFactory.build(1), '', false, 1, 'remark1'),
      new CrewPositionModel(AirmanModelFactory.build(2), '', false, 2, 'remark2'),
    ];

  static build(id: number = 1) {
    return new CrewModel(
      id,
      MissionModelFactory.build(),
      CrewModelFactory.crewPositions
    );
  }
}