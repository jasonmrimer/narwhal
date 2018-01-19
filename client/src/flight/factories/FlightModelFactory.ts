import FlightModel from '../model/FlightModel';
import { randomText } from '../../utils/randomizer';

export default class FlightModelFactory {
  static build(id: number) {
    return new FlightModel(id, randomText(4));
  }
}