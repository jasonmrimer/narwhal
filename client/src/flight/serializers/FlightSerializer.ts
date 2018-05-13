import { Serializer } from '../../utils/serializer';
import { FlightModel } from '../model/FlightModel';
import { AirmanSerializer } from '../../airman/serializers/AirmanSerializer';

export class FlightSerializer implements Serializer<FlightModel> {
	private airmanSerializer: AirmanSerializer = new AirmanSerializer();

	serialize(item: FlightModel): {} {
    throw new Error('Not Implemented');
  }

  deserialize(item: any): FlightModel {
    return new FlightModel(
      item.id,
      item.name,
			   item.airmen.map((airman: any) => this.airmanSerializer.deserialize(airman))
		);
  }
}