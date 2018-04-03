import { EventModel } from '../models/EventModel';
import { Moment } from 'moment';

export interface EventRepository {
  save(event: EventModel): Promise<EventModel>;
  delete(event: EventModel): Promise<void>;
  findAllWithinPeriod(start: Moment, end: Moment): Promise<EventModel[]>;
  findAllByAirmanIdAndWithinPeriod(id: number, start: Moment, end: Moment): Promise<EventModel[]>;
}
