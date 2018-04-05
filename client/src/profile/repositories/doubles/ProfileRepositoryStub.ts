import ProfileRepository from '../ProfileRepository';
import { ProfileModel, UserModel } from '../../models/ProfileModel';

export class ProfileRepositoryStub implements ProfileRepository {
  findOne(): Promise<ProfileModel> {
    return Promise.resolve({
      user: {id: 1, username: 'FontFace', siteId: 14},
      classified: false,
    });
  }

  save(user: UserModel): Promise<ProfileModel> {
    return Promise.resolve({user: user, classified: false});
  }
}
