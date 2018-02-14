import ProfileRepository from '../ProfileRepository';

export class WebProfileRepository implements ProfileRepository {
  constructor(private baseUrl: string = '') {}

  findOne(): Promise<{ username: string }> {
    return fetch(`${this.baseUrl}/api/profiles`, {credentials: 'include'})
      .then(resp => resp.json());
  }
}
