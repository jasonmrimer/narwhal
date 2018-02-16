import ProfileRepository from '../ProfileRepository';
import { ProfileModel } from '../../models/ProfileModel';

export class ProfileRepositoryStub implements ProfileRepository {
  findOne(): Promise<ProfileModel> {
    return Promise.resolve({username: 'FooFace', siteId: 1});
  }
}
