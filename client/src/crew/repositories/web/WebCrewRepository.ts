import { CrewRepository } from '../CrewRepository';
import { CrewSerializer } from '../../serializers/CrewSerializer';
import { CrewModel } from '../../models/CrewModel';
import * as Cookie from 'js-cookie';

export class WebCrewRepository implements CrewRepository {
  private serializer = new CrewSerializer();
  private csrfToken: string;

  constructor(private baseUrl: string = '') {
    this.csrfToken = Cookie.get('XSRF-TOKEN') || '';
  }

  async findOne(id: number) {
    const resp = await fetch(`${this.baseUrl}/api/crews/${id}`, {credentials: 'include'});
    const json = await resp.json();
    return this.serializer.deserialize(json);
  }

  async save(crew: CrewModel): Promise<CrewModel> {
    const resp = await fetch(
      `${this.baseUrl}/api/crews/${crew.id}/positions`,
      {
        method: 'PUT',
        body: JSON.stringify(crew.crewPositions.map((pos) => ({id: pos.id, title: pos.title}))),
        headers: [['Content-Type', 'application/json'], ['X-XSRF-TOKEN', this.csrfToken]],
        credentials: 'include',
      }
    );
    const json = await resp.json();
    return this.serializer.deserialize(json);
  }
}
