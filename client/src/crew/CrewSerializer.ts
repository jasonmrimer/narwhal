import { Serializer } from '../utils/serializer';
import CrewModel from './model/CrewModel';

export class CrewSerializer implements Serializer<CrewModel> {
  serialize(item: CrewModel): {} {
    throw new Error('Not implemented');
  }

  /* tslint:disable:no-any*/
  deserialize(item: any): CrewModel {
    return new CrewModel(item.id, item.name);
  }
}