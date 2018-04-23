import { ProfileSitePickerStore } from './ProfileSitePickerStore';
import { DoubleRepositories } from '../../utils/Repositories';
import { SiteModel, SiteType } from '../../site/models/SiteModel';

describe('ProfileSitePickerStore', () => {
  let subject: ProfileSitePickerStore;
  beforeEach(async () => {
    subject = new ProfileSitePickerStore(DoubleRepositories);
    const sites = [
        new SiteModel(1, 'JoshPC', [], SiteType.GuardSite, ''),
        new SiteModel(14, 'CoryPc', [], SiteType.DMSSite, ''),
        new SiteModel(5, 'CoryPc', [], SiteType.DGSCoreSite, '')
    ];
    subject.hydrate(sites, {
      id: 1,
      username: 'FontFace',
      siteId: 14,
      siteName: 'SITE 14',
      roleId: 1,
      roleName: 'ADMIN',
      classified: false
    });
  });

  it('should return profile', async () => {
    expect(subject.profile).toEqual({
      id: 1,
      username: 'FontFace',
      siteId: 14,
      siteName: 'SITE 14',
      roleId: 1,
      roleName: 'ADMIN',
      classified: false
    });
  });

  it('should save the selected site it to the profile', async () => {
    subject.setPendingSite(subject.guardSites[0]);
    await subject.savePendingSite();
    expect(subject.profile!.siteId).toEqual(1);
  });

  it('should separate sites by site types', () => {
    expect(subject.dgsCoreSites.length).toBe(1);
    expect(subject.dgsCoreSites[0].siteType).toBe(SiteType.DGSCoreSite);

    expect(subject.dmsSites.length).toBe(1);
    expect(subject.dmsSites[0].siteType).toBe(SiteType.DMSSite);

    expect(subject.guardSites.length).toBe(1);
    expect(subject.guardSites[0].siteType).toBe(SiteType.GuardSite);
  });
});