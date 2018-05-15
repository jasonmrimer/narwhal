import { CrewRepository } from '../CrewRepository';
import { CrewSerializer } from '../../serializers/CrewSerializer';
import { HTTPClient } from '../../../utils/HTTPClient';
import { EventModel } from '../../../event/models/EventModel';
import { EventSerializer } from '../../../event/serializers/EventSerializer';

export class WebCrewRepository implements CrewRepository {
  private crewSerializer = new CrewSerializer();
  private eventSerializer = new EventSerializer();

  constructor(private client: HTTPClient) {
  }

  async findOne(id: number) {
    const json = await this.client.getJSON(`/api/crews/${id}`);
    return this.crewSerializer.deserialize(json);
  }

  async save(event: EventModel): Promise<EventModel> {
    return await this.client.putJSON(`api/crews`, this.eventSerializer.serialize(event));
  }
}
