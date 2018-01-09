import SquadronModel from '../models/SquadronModel';
import FlightModel from '../../flight/model/FlightModel';

export default class SquadronModelFactory {
  static build(id: number) {
    return new SquadronModel(id, 'A', [
      new FlightModel(1, id, 'DOA')
    ]);
  }
}
