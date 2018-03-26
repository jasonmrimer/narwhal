import { ProfileSitePickerStore } from './ProfileSitePickerStore';
import { forIt } from '../../utils/testUtils';
import { DoubleRepositories } from '../../Repositories';

describe('ProfileSitePickerStore', () => {
  let subject: ProfileSitePickerStore;
  beforeEach(async () => {
    subject = new ProfileSitePickerStore(DoubleRepositories);
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