import ProfileRepository from '../ProfileRepository';
import { ProfileModel, UserModel } from '../../models/ProfileModel';

export class ProfileRepositoryStub implements ProfileRepository {
  findOne(): Promise<ProfileModel> {
    const profile = {
      user: {id: 1, username: 'FontFace', siteId: 1},
      classified: false,
    };

    return Promise.resolve(profile);
  }

  save(user: UserModel): Promise<ProfileModel> {
    return Promise.resolve({user: user, classified: false});
  }
}
