import { AdminSiteRepository } from '../AdminSiteRepository';
import { HTTPClient } from '../../../utils/HTTPClient';
import { AdminSiteItemSerializer } from '../../serializers/AdminSiteItemSerializer';
import { AdminSiteModel } from '../../models/AdminSiteModel';

export class WebAdminSiteRepository implements AdminSiteRepository {
  private serializer = new AdminSiteItemSerializer();

  constructor(private client: HTTPClient) {
  }

  async findAll(): Promise<AdminSiteModel[]> {
    const json = await this.client.getJSON('/api/admin/sites');
    console.log(json);
    return json.map((obj: any) => {
      return this.serializer.deserialize(obj);
    });
  }
}