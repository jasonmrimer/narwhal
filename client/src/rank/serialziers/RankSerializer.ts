import { Serializer } from '../../utils/serializer';
import { RankModel } from '../models/RankModel';

export class RankSerializer implements Serializer<RankModel> {
  deserialize(item: any): RankModel {
    return new RankModel(
      item.id,
      item.abbreviation
    );
  }

  serialize(item: RankModel): any {
    throw new Error('Not implemented');
  }

}