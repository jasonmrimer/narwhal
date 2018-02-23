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
    expect(subject.profile).toEqual({id: 1, username: 'FontFace', siteId: 1});
  });

  it('should update a profile with given information', async () => {
    const updatedProfile = {id: 1, username: 'FooFace', siteId: 2};
    subject.setProfile(updatedProfile);
    await subject.save();
    expect(subject.profile).toEqual(updatedProfile);
  });
});