import ProfileRepository from '../ProfileRepository';
import { ProfileModel, UserModel } from '../../models/ProfileModel';
import { HTTPClient } from '../../../HTTPClient';

export class WebProfileRepository implements ProfileRepository {

  constructor(private client: HTTPClient) {
  }

  async findOne(): Promise<ProfileModel> {
    const json = await this.client.getJSON('api/profiles');
    return {user: json.profile, classified: json.classified};
  }

  async save(user: UserModel): Promise<ProfileModel> {
    const json = await this.client.putJSON('api/profiles', JSON.stringify(user));
    return {user: json.profile, classified: json.classified};
  }
}
