import { CrewRepository } from '../CrewRepository';
import { CrewSerializer } from '../../serializers/CrewSerializer';
import { HTTPClient } from '../../../HTTPClient';

export class WebCrewRepository implements CrewRepository {
  private serializer = new CrewSerializer();

  constructor(private client: HTTPClient) {
  }

  async findOne(id: number) {
    const json = await this.client.getJSON(`/api/crews/${id}`);
    return this.serializer.deserialize(json);
  }
}
