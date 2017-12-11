import RosterModel from '../models/RosterModel';
import RosterRepository from './RosterRepository';
import RosterModelFactory from '../factories/RosterModelFactory';

export default class RosterRepositoryStub implements RosterRepository {
  findOne() {
    return Promise.resolve(RosterModelFactory.build());
  }

  findByUnit(id: number): Promise<RosterModel> {
    return Promise.resolve(RosterModelFactory.buildForUnit(id));
  }
}