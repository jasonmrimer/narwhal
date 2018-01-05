import CrewModel from '../model/CrewModel';
import { randomText } from '../../utils/randomizer';

export default class CrewModelFactory {
  static build(id: number, unitId: number = 1) {
    return new CrewModel(id, unitId, randomText(4));
  }

  static buildList(amount: number, unitId: number) {
    return Array(amount).fill(null).map((_, i) => {
      return this.build(i, unitId);
    });
  }
}