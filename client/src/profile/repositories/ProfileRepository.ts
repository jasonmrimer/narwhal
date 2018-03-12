import { ProfileModel, UserModel } from '../models/ProfileModel';

interface ProfileRepository {
  findOne(): Promise<ProfileModel>;
  save(user: UserModel): Promise<ProfileModel>;
}

export default ProfileRepository;
