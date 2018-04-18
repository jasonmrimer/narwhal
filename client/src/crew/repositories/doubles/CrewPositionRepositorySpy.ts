import { CrewPositionModel } from '../../models/CrewPositionModel';
import { CrewModel } from '../../models/CrewModel';
import { MissionModelFactory } from '../../../mission/factories/MissionModelFactory';

export class CrewPositionRepositorySpy {
  delete(crewPositions: CrewPositionModel[]) {
    return Promise.resolve();
  }

  update(crewPositions: CrewPositionModel[], id: number) {
    return Promise.resolve(new CrewModel(id, MissionModelFactory.build(), crewPositions));
  }
}