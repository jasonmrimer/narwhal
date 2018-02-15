import { Serializer } from '../../utils/serializer';
import { EventModel } from '../models/EventModel';
import * as moment from 'moment';

export class EventSerializer implements Serializer<EventModel> {
  serialize(item: EventModel): {} {
    return JSON.stringify(item);
  }

  /* tslint:disable:no-any*/
  deserialize(item: any): EventModel {
    return new EventModel(
      item.title,
      item.description,
      moment(item.startTime),
      moment(item.endTime),
      item.airmanId,
      item.type,
      item.id,
    );
  }
}