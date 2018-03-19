import { MissionModel } from '../models/MissionModel';

export interface MissionRepository {
  findAll(): Promise<MissionModel[]>;
}
