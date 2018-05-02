import { Serializer } from '../../utils/serializer';
import { ScheduleModel } from '../models/ScheduleModel';

export class ScheduleSerializer implements Serializer<ScheduleModel> {
  deserialize(item: any): ScheduleModel {
    return new ScheduleModel(
      item.id,
      item.type,
      item.sunday,
      item.monday,
      item.tuesday,
      item.wednesday,
      item.thursday,
      item.friday,
      item.saturday,
    );
  }

  serialize(item: ScheduleModel): {} {
    return {
      id: item.id,
      type: item.type,
      sunday: item.sunday,
      monday: item.monday,
      tuesday: item.tuesday,
      wednesday: item.wednesday,
      thursday: item.thursday,
      friday: item.friday,
      saturday: item.saturday
    };
  }
}
