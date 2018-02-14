import { SiteRepository } from '../SiteRepository';
import { SiteModel } from '../../models/SiteModel';
import { SiteSerializer } from '../../serializers/SiteSerializer';

export class WebSiteRepository implements SiteRepository {
  private static siteSerializer: SiteSerializer = new SiteSerializer();

  constructor(private baseUrl: string = '') {
  }

  findAll(): Promise<SiteModel[]> {
    return fetch(`${this.baseUrl}/api/sites`, {credentials: 'include'})
      .then(resp => resp.json())
      .then(items => items.map((item: {}) => WebSiteRepository.siteSerializer.deserialize(item)));
  }
}
