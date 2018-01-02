import siteRepositoryContract from '../SiteRepositoryContract';
import WebSiteRepository from './WebSiteRepository';

describe('WebSiteRepository', () => {
  const HOST = process.env.REACT_APP_HOST || 'http://localhost:8080';
  siteRepositoryContract(new WebSiteRepository(HOST));
});
