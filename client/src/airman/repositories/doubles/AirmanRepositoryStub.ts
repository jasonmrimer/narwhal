import AirmanRepository from '../AirmanRepository';
import AirmanModelFactory from '../../factories/AirmanModelFactory';
import AirmanModel from '../../models/AirmanModel';

export default class AirmanRepositoryStub implements AirmanRepository {
  findAll() {
    return Promise.resolve(AirmanModelFactory.buildList());
  }

  findByUnit(id: number) {
    return Promise.resolve(AirmanModelFactory.buildForUnit(id));
  }

  findByCrew(id: number): Promise<AirmanModel[]> {
    return Promise.resolve(AirmanModelFactory.buildForCrew(id));
  }
}