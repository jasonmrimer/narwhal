import { Serializer } from '../../utils/serializer';
import SquadronModel from '../models/SquadronModel';
import FlightSerializer from '../../flight/serializers/FlightSerializer';

export default class SquadronSerializer implements Serializer<SquadronModel> {
  private flightSerializer: FlightSerializer = new FlightSerializer();

  serialize(item: SquadronModel): {} {
    throw new Error('Not Implemented');
  }

  /* tslint:disable:no-any */
  deserialize(item: any): SquadronModel {
    return new SquadronModel(
      item.id,
      item.name,
      item.flights.map((flight: {}) => this.flightSerializer.deserialize(flight))
    );
  }
}