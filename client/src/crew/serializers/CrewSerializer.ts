import { Serializer } from '../../utils/serializer';
import { CrewModel } from '../models/CrewModel';
import { MissionSerializer } from '../../mission/serializers/MissionSerializer';
import { CrewPositionSerializer } from './CrewPositionSerializer';

export class CrewSerializer implements Serializer<CrewModel> {
  private missionSerializer = new MissionSerializer();
  private crewPositionSerializer = new CrewPositionSerializer();

  serialize(item: CrewModel): {} {
    throw new Error('Not Implemented');
  }

  deserialize(item: any): CrewModel {
    return new CrewModel(
      item.id,
      this.missionSerializer.deserialize(item.mission),
      item.crewPositions.map((position: object) => this.crewPositionSerializer.deserialize(position))
    );
  }
}