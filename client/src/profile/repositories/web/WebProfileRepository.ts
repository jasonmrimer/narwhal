import { ProfileRepository } from '../ProfileRepository';
import { ProfileModel } from '../../models/ProfileModel';
import { HTTPClient } from '../../../utils/HTTPClient';

export class WebProfileRepository implements ProfileRepository {

  constructor(private client: HTTPClient) {
  }

  async findAll(): Promise<ProfileModel[]> {
    return (await this.client.getJSON('api/profiles'));
  }

  async findOne(): Promise<ProfileModel> {
    return (await this.client.getJSON('api/profiles/me'));
  }

  async updateSite(siteId: number): Promise<ProfileModel> {
    return (await this.client.put(`api/profiles/me?siteId=${siteId}`));
  }

  async updateSiteAndSquadron(siteId: number, squadronId: number): Promise<ProfileModel> {
    return (await this.client.put(`api/profiles/me?siteId=${siteId}&squadronId=${squadronId}`));
  }

  async save(profile: ProfileModel): Promise<ProfileModel> {
    return (await this.client.putJSON(`api/profiles`, JSON.stringify(profile)));
  }

  async findAllRoles(): Promise<{ id: number; name: string }[]> {
    return (await this.client.getJSON('api/profiles/roles'));
  }
}
