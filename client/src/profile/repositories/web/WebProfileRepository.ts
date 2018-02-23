import ProfileRepository from '../ProfileRepository';
import { ProfileModel } from '../../models/ProfileModel';
import * as Cookie from 'js-cookie';

export class WebProfileRepository implements ProfileRepository {
  csrfToken: string;

  constructor(private baseUrl: string = '') {
    this.csrfToken = Cookie.get('XSRF-TOKEN') || '';
  }

  findOne(): Promise<ProfileModel> {
    return fetch(`${this.baseUrl}/api/profiles`, {credentials: 'include'})
      .then(resp => resp.json());
  }

  save(profile: ProfileModel): Promise<ProfileModel> {
    return fetch(
      `${this.baseUrl}/api/profiles`,
      {
        method: 'PUT',
        headers: [['Content-Type', 'application/json'], ['X-XSRF-TOKEN', this.csrfToken]],
        body: JSON.stringify(profile),
        credentials: 'include'
      })
      .then(resp => resp.json());
  }
}
