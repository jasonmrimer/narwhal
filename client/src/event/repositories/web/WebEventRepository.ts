import EventRepository from '../EventRepository';
import EventModel from '../../EventModel';
import EventSerializer from '../../EventSerializer';

export default class WebEventRepository implements EventRepository {
  private serializer: EventSerializer = new EventSerializer();

  constructor(private baseUrl: string = '') {
  }

  async save(event: EventModel): Promise<EventModel> {
    const resp = await fetch(
      `${this.baseUrl}/api/events`,
      {
        method: 'POST',
        headers: [['Content-Type', 'application/json']],
        body: this.serializer.serialize(event),
        credentials: 'include'
      }
    );
    const json = await resp.json();
    return Promise.resolve(this.serializer.deserialize(json));
  }
}
