import { AdminSquadronModel } from '../models/AdminSquadronModel';
import { Serializer } from '../../utils/serializer';

export class AdminSquadronItemSerializer implements Serializer<AdminSquadronModel> {
  serialize(item: AdminSquadronModel): string {
    return JSON.stringify({
      siteId: item.siteId,
      siteName: item.siteName,
      squadronId: item.squadronId,
      squadronName: item.squadronName
    });
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