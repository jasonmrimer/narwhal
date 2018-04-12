import { MissionRepository } from '../MissionRepository';
import { MissionModel } from '../../models/MissionModel';
import { MissionSerializer } from '../../serializers/MissionSerializer';
import { HTTPClient } from '../../../utils/HTTPClient';
import * as moment from 'moment';
import { UnfilteredValue } from '../../../widgets/models/FilterOptionModel';

export class WebMissionRepository implements MissionRepository {
  private serializer: MissionSerializer = new MissionSerializer();

  constructor(private client: HTTPClient) {
  }

  async findAll(): Promise<MissionModel[]> {
    const json = await this.client.getJSON('api/missions');
    return json.map((obj: object) => this.serializer.deserialize(obj));
  }

  async findPlatforms(siteId: number): Promise<string[]> {
    const startDateTime = moment();
    const endDateTime = moment().add(30, 'days');

    return siteId === UnfilteredValue ?
      await this.client.getJSON(
        `api/missions/platforms?startDateTime=${startDateTime.toISOString()}&endDateTime=${endDateTime.toISOString()}`
      ) :
      await this.client.getJSON(
        `api/missions/platforms?siteId=${siteId}&startDateTime=${startDateTime.toISOString()}&endDateTime=${endDateTime.toISOString()}`
      );
  }
}
