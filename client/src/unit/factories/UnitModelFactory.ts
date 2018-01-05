import UnitModel from '../models/UnitModel';

export default class UnitModelFactory {
  static build(id: number) {
    return new UnitModel(id, 'A');
  }
}
