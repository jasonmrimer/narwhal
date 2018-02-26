import { EventModel } from '../models/EventModel';

export interface EventActions {
  addEvent: (event: EventModel) => void;
  removeEvent: (event: EventModel) => void;
}