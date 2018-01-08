import FlightModel from '../model/FlightModel';
import { randomText } from '../../utils/randomizer';

export default class FlightModelFactory {
  static build(id: number, unitId: number = 1) {
    return new FlightModel(id, unitId, randomText(4));
  }
}