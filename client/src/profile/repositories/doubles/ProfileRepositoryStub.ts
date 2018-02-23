import ProfileRepository from '../ProfileRepository';
import { ProfileModel } from '../../models/ProfileModel';

export class ProfileRepositoryStub implements ProfileRepository {
  findOne(): Promise<ProfileModel> {
    return Promise.resolve({id: 1, username: 'FontFace', siteId: 1});
  }

  save(profile: ProfileModel): Promise<ProfileModel> {
    return Promise.resolve(profile);
  }
}
