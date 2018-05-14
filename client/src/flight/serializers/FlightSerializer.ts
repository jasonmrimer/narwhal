import { Serializer } from '../../utils/serializer';
import { FlightModel } from '../model/FlightModel';

export class FlightSerializer implements Serializer<FlightModel> {

  serialize(item: FlightModel): {} {
    throw new Error('Not Implemented');
  }

  deserialize(item: any): FlightModel {
    return new FlightModel(
      item.id,
      item.name
    );
  }
}