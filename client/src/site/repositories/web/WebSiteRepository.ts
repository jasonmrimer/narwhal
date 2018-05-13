import { SiteRepository } from '../SiteRepository';
import { SiteModel } from '../../models/SiteModel';
import { SiteSerializer } from '../../serializers/SiteSerializer';
import { HTTPClient } from '../../../utils/HTTPClient';

export class WebSiteRepository implements SiteRepository {
  private siteSerializer: SiteSerializer = new SiteSerializer();

  constructor(private client: HTTPClient) {
  }

  async findAll(): Promise<SiteModel[]> {
    const json = await this.client.getJSON('api/sites');
    return json.map((item: {}) => this.siteSerializer.deserialize(item));
  }

	async findOne(siteId: number): Promise<SiteModel> {
		const json = await this.client.getJSON(`api/sites/${siteId}`);
		return this.siteSerializer.deserialize(json);
	}
}
