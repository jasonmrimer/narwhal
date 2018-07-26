import { AdminSquadronModel } from '../models/AdminSquadronModel';
import { Serializer } from '../../utils/serializer';

export class AdminSquadronItemSerializer implements Serializer<AdminSquadronModel> {
  serialize(item: AdminSquadronModel): string {
    return JSON.stringify(item);
  }

  deserialize(item: any): AdminSquadronModel {
    return new AdminSquadronModel(
      item.siteId,
      item.siteName,
      item.squadronId,
      item.squadronName
    );
  }
}