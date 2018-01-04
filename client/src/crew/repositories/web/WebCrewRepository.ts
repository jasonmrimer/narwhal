import CrewRepository from '../CrewRepository';
import CrewModel from '../../model/CrewModel';

export default class WebCrewRepository implements CrewRepository {
  constructor(private baseUrl: string = '') {
  }

  findAll(): Promise<CrewModel[]> {
    return fetch(`${this.baseUrl}/api/crews`, {credentials: 'include'})
      .then(resp => resp.json());
  }
}
