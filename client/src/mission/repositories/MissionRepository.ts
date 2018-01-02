import { MissionModel } from '../models/MissionModel';

interface MissionRepository {
  findAll(): Promise<MissionModel[]>;

  findBySite(id: number): Promise<MissionModel[]>;
}

export default MissionRepository;
