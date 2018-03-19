import { MissionRepository } from '../MissionRepository';
import { MissionModel } from '../../models/MissionModel';
import { MissionSerializer } from '../../serializers/MissionSerializer';
import { HTTPClient } from '../../../HTTPClient';

export class WebMissionRepository implements MissionRepository {
  private serializer: MissionSerializer = new MissionSerializer();

  constructor(private client: HTTPClient) {
  }

  async findAll(): Promise<MissionModel[]> {
    const json = await this.client.getJSON('api/missions');
    return json.map((obj: object) => this.serializer.deserialize(obj));
  }
}
