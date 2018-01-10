import { Serializer } from '../utils/serializer';
import EventModel from './EventModel';
import * as moment from 'moment';

export default class EventSerializer implements Serializer<EventModel> {
  serialize(item: EventModel): {} {
    throw new Error('Not implemented');
  }

  /* tslint:disable:no-any*/
  deserialize(item: any): EventModel {
    return new EventModel(item.id, item.title, item.description, moment(item.startTime), moment(item.endTime));
  }
}