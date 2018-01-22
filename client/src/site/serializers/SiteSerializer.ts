import { Serializer } from '../../utils/serializer';
import SiteModel from '../models/SiteModel';
import SquadronSerializer from '../../squadron/serializers/SquadronSerializer';

export default class SiteSerializer implements Serializer<SiteModel> {
  private squadronSerializer: SquadronSerializer = new SquadronSerializer();

  serialize(item: SiteModel): {} {
    throw new Error('Not Implemented');
  }

  /* tslint:disable:no-any */
  deserialize(item: any): SiteModel {
    return new SiteModel(
      item.id,
      item.name,
      item.squadrons.map((squad: any) => this.squadronSerializer.deserialize(squad))
    );
  }
}