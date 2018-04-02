import { CrewPositionModel } from '../../models/CrewPositionModel';

export class CrewPositionRepositorySpy {
  delete(crewPositions: CrewPositionModel[]) {
    return Promise.resolve();
  }

  update(crewPositions: CrewPositionModel[], id: number) {
    return Promise.resolve(crewPositions);
  }
}