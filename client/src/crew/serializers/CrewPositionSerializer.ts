import { Serializer } from '../../utils/serializer';
import { CrewPositionModel } from '../models/CrewPositionModel';

export class CrewPositionSerializer implements Serializer<CrewPositionModel> {
  serialize(item: CrewPositionModel): {} {
    return {
      id: item.id,
      title: item.title,
      critical: item.critical,
      airmanId: item.airman == null ? null : item.airman.id,
      remarks: item.remarks,
      order: item.order,
      templateItemId: item.templateItemId
    };
  }

  deserialize(item: any): CrewPositionModel {
    return new CrewPositionModel(
      item.airman,
      item.title,
      item.critical,
      item.id,
      item.remarks,
      item.order,
      item.templateItemId
    );
  }
}