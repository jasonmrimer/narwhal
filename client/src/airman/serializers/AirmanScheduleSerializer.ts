import { Serializer } from '../../utils/serializer';
import { AirmanScheduleModel } from '../models/AirmanScheduleModel';
import { ScheduleModel } from '../../schedule/models/ScheduleModel';
import * as moment from 'moment';

export class AirmanScheduleSerializer implements Serializer<AirmanScheduleModel> {
  serialize(item: AirmanScheduleModel): {} {
    throw new Error('Not implemented');
  }

  deserialize(item: any): AirmanScheduleModel {
    const endDate = item.endDate === 'null' ? moment(item.endDate) : null;
    return new AirmanScheduleModel(
      item.id,
      item.airmanId,
      new ScheduleModel(
        item.schedule.id,
        item.schedule.type,
        item.schedule.sunday,
        item.schedule.monday,
        item.schedule.tuesday,
        item.schedule.wednesday,
        item.schedule.thursday,
        item.schedule.friday,
        item.schedule.saturday,
      ),
      moment(item.startDate),
      endDate
    );
  }
}