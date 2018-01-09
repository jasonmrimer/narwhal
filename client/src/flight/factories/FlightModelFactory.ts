import FlightModel from '../model/FlightModel';
import { randomText } from '../../utils/randomizer';

export default class FlightModelFactory {
  static build(id: number, squadronId: number = 1) {
    return new FlightModel(id, squadronId, randomText(4));
  }
}