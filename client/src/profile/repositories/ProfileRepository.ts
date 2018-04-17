import { ProfileModel } from '../models/ProfileModel';

interface ProfileRepository {
  findOne(): Promise<ProfileModel>;
  save(profile: ProfileModel): Promise<ProfileModel>;
}

export default ProfileRepository;
