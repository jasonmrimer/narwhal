import MissionRepository from '../MissionRepository';
import { MissionModel } from '../../models/MissionModel';

export default class WebMissionRepository implements MissionRepository {
  constructor(private baseUrl: string = '') {
  }

  async findAll(): Promise<MissionModel[]> {
    const resp = await fetch(`${this.baseUrl}/api/missions`, {credentials: 'include'});
    return await resp.json();
  }
}
