import CrewModel from '../model/CrewModel';
import { randomText } from '../../utils/randomizer';

export default class CrewModelFactory {
  static build(id: number, unitId: number = 1) {
    return new CrewModel(id, unitId, randomText(4));
  }
}