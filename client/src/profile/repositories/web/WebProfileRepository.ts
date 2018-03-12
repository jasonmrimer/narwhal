import ProfileRepository from '../ProfileRepository';
import { ProfileModel, UserModel } from '../../models/ProfileModel';
import * as Cookie from 'js-cookie';

export class WebProfileRepository implements ProfileRepository {
  csrfToken: string;

  constructor(private baseUrl: string = '') {
    this.csrfToken = Cookie.get('XSRF-TOKEN') || '';
  }

  async findOne(): Promise<ProfileModel> {
    const resp = await fetch(`${this.baseUrl}/api/profiles`, {credentials: 'include'});
    const json = await resp.json();
    return {user: json.profile, classified: json.classified};

  }

  save(user: UserModel): Promise<ProfileModel> {
    return fetch(
      `${this.baseUrl}/api/profiles`,
      {
        method: 'PUT',
        headers: [['Content-Type', 'application/json'], ['X-XSRF-TOKEN', this.csrfToken]],
        body: JSON.stringify(user),
        credentials: 'include'
      })
      .then(resp => resp.json());
  }
}
