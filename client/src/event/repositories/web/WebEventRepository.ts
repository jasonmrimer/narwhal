import { EventRepository } from '../EventRepository';
import { EventModel, EventType } from '../../models/EventModel';
import { EventSerializer } from '../../serializers/EventSerializer';
import { HTTPClient } from '../../../HTTPClient';
import { Moment } from 'moment';

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

  async findAllWithinPeriod(start: Moment, end: Moment): Promise<EventModel[]> {
    const json = await this.client.getJSON(`api/events?start=${start.toISOString()}&end=${end.toISOString()}`);
    return json.map((item: any) => this.serializer.deserialize(item));
  }

  async findAllByAirmanIdAndWithinPeriod(airmanId: number, start: Moment, end: Moment): Promise<EventModel[]> {
    const json = await this.client.getJSON(
      `api/events?airmanId=${airmanId}&start=${start.toISOString()}&end=${end.toISOString()}`
    );
    return json.map((item: any) => this.serializer.deserialize(item));
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
