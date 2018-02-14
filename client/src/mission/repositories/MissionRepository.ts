import { MissionModel } from '../models/MissionModel';

export interface MissionRepository {
  findAll(): Promise<MissionModel[]>;

  findBySite(id: number): Promise<MissionModel[]>;
}
