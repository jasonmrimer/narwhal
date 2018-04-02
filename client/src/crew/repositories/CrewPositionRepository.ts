import { CrewPositionModel } from '../models/CrewPositionModel';

export interface CrewPositionRepository {
  delete(crewPositions: CrewPositionModel[]): Promise<void>;
  update(crewPositions: CrewPositionModel[], missionId: number): Promise<CrewPositionModel[]>;
}