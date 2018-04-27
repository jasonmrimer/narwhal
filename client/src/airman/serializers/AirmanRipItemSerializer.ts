import { Serializer } from '../../utils/serializer';
import * as moment from 'moment';
import { AirmanRipItemModel } from '../models/AirmanRipItemModel';
import { RipItemSerializer } from '../../rip-item/serializers/RipItemSerializer';

export class AirmanRipItemSerializer implements Serializer<AirmanRipItemModel> {
  private ripItemSerializer: RipItemSerializer = new RipItemSerializer();

  serialize(item: AirmanRipItemModel): {} {
    return JSON.stringify(item);
  }

  deserialize(item: any): AirmanRipItemModel {
    return new AirmanRipItemModel(
      item.id,
      item.airmanId,
      this.ripItemSerializer.deserialize(item.ripItem),
      item.expirationDate ? moment(item.expirationDate) : null
    );
  }
}