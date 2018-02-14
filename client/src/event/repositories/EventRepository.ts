import { EventModel } from '../models/EventModel';

export interface EventRepository {
  save(event: EventModel): Promise<EventModel>;
  delete(event: EventModel): Promise<void>;
}
