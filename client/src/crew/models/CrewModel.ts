import { MissionModel } from '../../mission/models/MissionModel';
import { CrewPositionModel } from './CrewPositionModel';

export class CrewModel {
  constructor(public id: number,
              public mission: MissionModel,
              public crewPositions: CrewPositionModel[]) {
  }
}