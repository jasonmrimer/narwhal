import SiteRepositoryContract from '../SiteRepositoryContract';
import SiteRepositoryStub from './SiteRepositoryStub';

describe('SiteRepositoryStub', () => {
    SiteRepositoryContract(new SiteRepositoryStub());
});
