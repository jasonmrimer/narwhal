import { CrewRepository } from '../CrewRepository';
import { CrewSerializer } from '../../serializers/CrewSerializer';
import { CrewModel } from '../../models/CrewModel';
import { CrewPositionSerializer } from '../../serializers/CrewPositionSerializer';
import { HTTPClient } from '../../../HTTPClient';

export class WebCrewRepository implements CrewRepository {
  private serializer = new CrewSerializer();
  private crewPositionSerializer = new CrewPositionSerializer();

  constructor(private client: HTTPClient) {
  }

  async findOne(id: number) {
    const json = await this.client.getJSON(`/api/crews/${id}`);
    return this.serializer.deserialize(json);
  }

  async update(crew: CrewModel) {
    const body = JSON.stringify(crew.crewPositions.map(this.crewPositionSerializer.serialize));
    const json = await this.client.putJSON(`/api/crews/${crew.id}/positions`, body);
    return this.serializer.deserialize(json);
  }
}
