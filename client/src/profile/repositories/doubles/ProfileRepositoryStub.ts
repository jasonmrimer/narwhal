import ProfileRepository from '../ProfileRepository';
import { ProfileModel } from '../../models/ProfileModel';

export class ProfileRepositoryStub implements ProfileRepository {
  findOne(): Promise<ProfileModel> {
    return Promise.resolve({
      id: 1,
      username: 'FontFace',
      siteId: 14,
      role: 'ADMIN',
      classified: false,
    });
  }

  save(profile: ProfileModel): Promise<ProfileModel> {
    return Promise.resolve(profile);
  }
}
