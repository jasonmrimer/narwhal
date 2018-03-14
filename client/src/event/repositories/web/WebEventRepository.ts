import { EventRepository } from '../EventRepository';
import { EventModel, EventType } from '../../models/EventModel';
import { EventSerializer } from '../../serializers/EventSerializer';
import { HTTPClient } from '../../../HTTPClient';

export class WebEventRepository implements EventRepository {
  private serializer: EventSerializer = new EventSerializer();

  constructor(private client: HTTPClient) {
  }

  async save(event: EventModel) {
    try {
      return event.id ?
        await this.client.putJSON(`api/events/${event.id}`, this.serializer.serialize(event)) :
        await this.client.postJSON('api/events', this.serializer.serialize(event));
    } catch (e) {
      throw this.handleError(e);
    }
  }

  async delete(event: EventModel): Promise<void> {
    return event.type === EventType.Mission ?
      await this.client.delete(`api/crews/${event.id}/airmen/${event.airmanId}`) :
      await this.client.delete(`api/events/${event.id}`);
  }

  private handleError(response: { errors: object[] }): object {
    if (response.errors != null) {
      return response.errors.map((error: { field: string, defaultMessage: string }) => {
        return {[error.field]: error.defaultMessage};
      });
    }
    return [];
  }
}
