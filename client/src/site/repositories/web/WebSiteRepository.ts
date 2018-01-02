import SiteRepository from '../SiteRepository';
import SiteModel from '../../models/SiteModel';

export default class WebSiteRepository implements SiteRepository {
  constructor(private baseUrl: string = '') {
  }

  findAll(): Promise<SiteModel[]> {
    return fetch(`${this.baseUrl}/api/sites`, {credentials: 'include'})
      .then(resp => resp.json());
  }
}
