import { siteRepositoryContract } from '../SiteRepositoryContract';
import { SiteRepositoryStub } from './SiteRepositoryStub';

describe('SiteRepositoryStub', () => {
    siteRepositoryContract(new SiteRepositoryStub());
});
