import { EventModel, EventType } from '../models/EventModel';
import * as moment from 'moment';
import { Moment } from 'moment';

export class EventModelFactory {
  static build(title: string = 'Fake Event',
               description: string = 'To do things',
               startTime: Moment = moment(),
               endTime: Moment = moment(),
               airmanId: number = 1,
               type: EventType = EventType.Leave) {
    return new EventModel(title, description, startTime, endTime, airmanId, type);
  }
}