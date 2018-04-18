import { ProfileRepository } from '../ProfileRepository';
import { ProfileModel } from '../../models/ProfileModel';
import { HTTPClient } from '../../../utils/HTTPClient';

export class WebProfileRepository implements ProfileRepository {

  constructor(private client: HTTPClient) {
  }

  async findOne(): Promise<ProfileModel> {
    return (await this.client.getJSON('api/profiles'));
  }

  async save(profile: ProfileModel): Promise<ProfileModel> {
    return (await this.client.put(`api/profiles?siteId=${profile.siteId}`));
  }
}
