import UnitRepository from '../UnitRepository';
import UnitModel from '../../models/UnitModel';

export default class WebUnitRepository implements UnitRepository {
  constructor(private baseUrl: string = '') {
  }

  findAll(): Promise<UnitModel[]> {
    return fetch(`${this.baseUrl}/api/units`, {credentials: 'include'})
      .then(resp => resp.json());
  }
}