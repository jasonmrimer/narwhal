import { AdminSquadronModel } from '../../models/AdminSquadronModel';
import { AdminSquadronRepository } from '../AdminSquadronRepository';
import { HTTPClient } from '../../../utils/HTTPClient';

export class WebAdminSquadronRepository implements AdminSquadronRepository {
  constructor(private client: HTTPClient) {
  }
  async findAll(): Promise<AdminSquadronModel[]> {
    const json = await this.client.getJSON('/api/admin/squadrons');
    return json.map((obj: any) => {
      return new AdminSquadronModel(
        obj.siteId,
        obj.siteName,
        obj.squadronId,
        obj.squadronName
      );
    });
  }
}