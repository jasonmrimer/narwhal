import { HTTPClient } from '../../../HTTPClient';
import { CrewPositionRepository } from '../CrewPositionRepository';
import { CrewPositionSerializer } from '../../serializers/CrewPositionSerializer';
import { CrewPositionModel } from '../../models/CrewPositionModel';

export class WebCrewPositionRepository implements CrewPositionRepository {
  private crewPositionSerializer = new CrewPositionSerializer();

  constructor(private client: HTTPClient) {
  }

  async delete(crewPositions: CrewPositionModel[]): Promise<void> {
    const body = JSON.stringify(crewPositions.map(this.crewPositionSerializer.serialize));
    return await this.client.delete(`/api/crew_positions/`, body);
  }

  async update(crewPositions: CrewPositionModel[], missionId: number) {
    const body = JSON.stringify(crewPositions.map(this.crewPositionSerializer.serialize));
    const json = await this.client.putJSON(`/api/crew_positions/${missionId}`, body);
    return json.map((position: any) => {
      return this.crewPositionSerializer.deserialize(position);
    });
  }
}
