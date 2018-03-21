import { ProfileSitePickerStore } from './ProfileSitePickerStore';
import { ProfileRepositoryStub } from '../repositories/doubles/ProfileRepositoryStub';
import { forIt } from '../../utils/testUtils';
import { SiteRepositoryStub } from '../../site/repositories/doubles/SiteRepositoryStub';

describe('ProfileSitePickerStore', () => {
  let subject: ProfileSitePickerStore;
  beforeEach(async () => {
    subject = new ProfileSitePickerStore(new ProfileRepositoryStub(), new SiteRepositoryStub());
    subject.hydrate();
    await forIt();
  });

  it('should return profile', async () => {
    expect(subject.profile).toEqual({
      user: {id: 1, username: 'FontFace', siteId: 1},
      classified: false
    });
  });

  it('should save the selected site it to the profile', async () => {
    await subject.saveSiteId(2);
    expect(subject.profile!.user.siteId).toEqual(2);
  });
});