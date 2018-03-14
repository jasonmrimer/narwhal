import { siteRepositoryContract } from '../SiteRepositoryContract';
import { WebSiteRepository } from './WebSiteRepository';
import { HTTPClient } from '../../../HTTPClient';

describe('WebSiteRepository', () => {
  const client = new HTTPClient(process.env.REACT_APP_HOST || 'http://localhost:8080');
  siteRepositoryContract(new WebSiteRepository(client));
});
