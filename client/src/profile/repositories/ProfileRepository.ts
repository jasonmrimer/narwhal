import { ProfileModel } from '../models/ProfileModel';
import { ErrorResponse } from '../../utils/HTTPClient';

export interface ProfileRepository {
  findAll(): Promise<ProfileModel[] | ErrorResponse>;

  findOne(): Promise<ProfileModel>;

  save(profile: ProfileModel): Promise<ProfileModel>;
}
