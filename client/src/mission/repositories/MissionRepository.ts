import { MissionModel } from '../models/MissionModel';

interface MissionRepository {
  findAll(): Promise<MissionModel[]>;
}

export default MissionRepository;
