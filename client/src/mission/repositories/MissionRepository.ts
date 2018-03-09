import { MissionModel } from '../models/MissionModel';

export interface MissionRepository {
  findAll(): Promise<MissionModel[]>;
  findAllFromTodayOn(): Promise<MissionModel[]>;
  findBySite(id: number): Promise<MissionModel[]>;
}
