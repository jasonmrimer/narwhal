import { CrewRepository } from '../CrewRepository';
import { CrewSerializer } from '../../serializers/CrewSerializer';

export class WebCrewRepository implements CrewRepository {
  private serializer = new CrewSerializer();

  constructor(private baseUrl: string = '') {
  }

  async findOne(id: number) {
    const resp = await fetch(`${this.baseUrl}/api/crews/${id}`, {credentials: 'include'});
    const json = await resp.json();
    return this.serializer.deserialize(json);
  }
}
