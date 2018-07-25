import { AdminSquadronModel } from '../../models/AdminSquadronModel';
import { AdminSquadronRepository } from '../AdminSquadronRepository';
import { HTTPClient } from '../../../utils/HTTPClient';
import { AdminSquadronItemSerializer } from '../../serializers/AdminSquadronItemSerializer';

export class WebAdminSquadronRepository implements AdminSquadronRepository {
  private serializer = new AdminSquadronItemSerializer();

  constructor(private client: HTTPClient) {
  }

  async findAll(): Promise<AdminSquadronModel[]> {
    const json = await this.client.getJSON('/api/admin/squadrons');
    return json.map((obj: any) => {
      return this.serializer.deserialize(obj);
    });
  }

  async saveSquadron(squadron: AdminSquadronModel): Promise<AdminSquadronModel> {
    const json = await this.client.postJSON('/api/admin/squadrons', this.serializer.serialize(squadron));
    return this.serializer.deserialize(json);
  }
}