import { HTTPClient } from '../../../utils/HTTPClient';
import { CrewPositionRepository } from '../CrewPositionRepository';
import { CrewPositionSerializer } from '../../serializers/CrewPositionSerializer';
import { CrewPositionModel } from '../../models/CrewPositionModel';
import { CrewSerializer } from '../../serializers/CrewSerializer';

export class WebCrewPositionRepository implements CrewPositionRepository {
  private crewPositionSerializer = new CrewPositionSerializer();
  private crewSerializer = new CrewSerializer();

  constructor(private client: HTTPClient) {
  }

  async delete(crewPositions: CrewPositionModel[]): Promise<void> {
    const body = JSON.stringify(crewPositions.map(this.crewPositionSerializer.serialize));
    return await this.client.delete(`/api/crew_positions/`, body);
  }

  async update(crewPositions: CrewPositionModel[], missionId: number) {
    const body = JSON.stringify(crewPositions.map(this.crewPositionSerializer.serialize));
    const json = await this.client.putJSON(`/api/crew_positions/${missionId}`, body);
    return this.crewSerializer.deserialize(json);
  }
}
