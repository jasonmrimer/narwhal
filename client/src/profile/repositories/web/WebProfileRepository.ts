import ProfileRepository from '../ProfileRepository';
import { ProfileModel } from '../../models/ProfileModel';

export class WebProfileRepository implements ProfileRepository {
  constructor(private baseUrl: string = '') {
  }

  findOne(): Promise<ProfileModel> {
    return fetch(`${this.baseUrl}/api/profiles`, {credentials: 'include'})
      .then(resp => resp.json());
  }
}
