import SquadronRepository from '../SquadronRepository';
import SquadronModel from '../../models/SquadronModel';
import SquadronModelFactory from '../../factories/SquadronModelFactory';

const squadrons = [
  SquadronModelFactory.build(1),
  SquadronModelFactory.build(2)
];

export default class SquadronRepositoryStub implements SquadronRepository {
  findAll(): Promise<SquadronModel[]> {
    return Promise.resolve(squadrons);
  }
}