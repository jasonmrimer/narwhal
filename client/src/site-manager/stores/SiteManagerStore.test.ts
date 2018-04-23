import { SiteManagerStore } from './SiteManagerStore';
import { DoubleRepositories } from '../../utils/Repositories';

describe('SiteManagerStore', () => {
  let subject: SiteManagerStore;
  beforeEach(async () => {
    subject = new SiteManagerStore(DoubleRepositories);

    await subject.hydrate();
  });

  it('should provide a list of airmen by siteId', () => {
    expect(subject.airmen.length).toBe(10);
  });

  it('should provide the current site', () => {
    expect(subject.siteName).toBe('SITE 14');
  });
});