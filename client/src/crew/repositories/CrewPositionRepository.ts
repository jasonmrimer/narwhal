import { CrewPositionModel } from '../models/CrewPositionModel';
import { CrewModel } from '../models/CrewModel';

export interface CrewPositionRepository {
  delete(crewPositions: CrewPositionModel[]): Promise<void>;
  update(crewPositions: CrewPositionModel[], missionId: number): Promise<CrewModel>;
}