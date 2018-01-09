import SquadronRepository from '../SquadronRepository';
import SquadronModel from '../../models/SquadronModel';

export default class WebSquadronRepository implements SquadronRepository {
  constructor(private baseUrl: string = '') {
  }

  async findAll(): Promise<SquadronModel[]> {
    const resp = await fetch(`${this.baseUrl}/api/squadrons`, {credentials: 'include'})
    const json = await resp.json();
    return json;
  }
}