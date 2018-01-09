import SquadronModel from '../models/SquadronModel';

export default class SquadronModelFactory {
  static build(id: number) {
    return new SquadronModel(id, 'A');
  }
}
