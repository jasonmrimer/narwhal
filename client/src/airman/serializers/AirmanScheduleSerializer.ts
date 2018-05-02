import { Serializer } from '../../utils/serializer';
import { AirmanScheduleModel } from '../models/AirmanScheduleModel';
import * as moment from 'moment';
import { ScheduleSerializer } from '../../schedule/serializers/ScheduleSerializer';

export class AirmanScheduleSerializer implements Serializer<AirmanScheduleModel> {
  private scheduleSerializer = new ScheduleSerializer();

  serialize(item: AirmanScheduleModel): {} {
    throw new Error('Not implemented');
  }

  deserialize(item: any): AirmanScheduleModel {
    const endDate = item.endDate != null ? moment(item.endDate) : null;
    return new AirmanScheduleModel(
      item.airmanId,
      this.scheduleSerializer.deserialize(item.schedule),
      moment(item.startDate),
      endDate,
      item.id,
    );
  }
}