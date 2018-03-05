import { Serializer } from '../../utils/serializer';
import { CrewPositionModel } from '../models/CrewPositionModel';

export class CrewPositionSerializer implements Serializer<CrewPositionModel> {
  serialize(item: CrewPositionModel): {} {
    throw new Error('Not implemented');
  }

  /* tslint:disable:no-any*/
  deserialize(item: any): CrewPositionModel {
    return new CrewPositionModel(
      item.airman,
      item.title,
      item.critical,
      item.id,
    );
  }
}