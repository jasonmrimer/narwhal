import { MissionModel } from '../models/MissionModel';

export interface MissionRepository {
  findAll(): Promise<MissionModel[]>;
  findPlatforms(siteId: number): Promise<string[]>;
}
