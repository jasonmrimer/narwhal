import { ProfileModel } from '../models/ProfileModel';

interface ProfileRepository {
  findOne(): Promise<ProfileModel>;
}

export default ProfileRepository;
