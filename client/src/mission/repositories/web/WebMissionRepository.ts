import MissionRepository from '../MissionRepository';
import { MissionModel } from '../../models/MissionModel';
import { MissionSerializer } from '../../serializers/MissionSerializer';

export default class WebMissionRepository implements MissionRepository {
  private serializer: MissionSerializer = new MissionSerializer();

  constructor(private baseUrl: string = '') {
  }

  async findAll(): Promise<MissionModel[]> {
    const resp = await fetch(`${this.baseUrl}/api/missions`, {credentials: 'include'});
    const json = await resp.json();
    return json.map((obj: object) => this.serializer.deserialize(obj));
  }

  async findBySite(id: number) {
    const resp = await fetch(`${this.baseUrl}/api/missions?site=${id}`, {credentials: 'include'});
    const json = await resp.json();
    return json.map((obj: object) => {
      return this.serializer.deserialize(obj);
    });
  }
}
