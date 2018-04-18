import { ProfileModel } from '../models/ProfileModel';

export interface ProfileRepository {
  findOne(): Promise<ProfileModel>;
  save(profile: ProfileModel): Promise<ProfileModel>;
}

