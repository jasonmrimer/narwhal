import { Serializer } from '../../utils/serializer';
import { RipItemModel } from '../models/RipItemModel';

export class RipItemSerializer implements Serializer<RipItemModel> {

  serialize(item: RipItemModel): {} {
    throw new Error('Not Implemented');
  }

  /* tslint:disable:no-any */
  deserialize(item: any): RipItemModel {
    return new RipItemModel(
      item.id,
      item.title
    );
  }
}