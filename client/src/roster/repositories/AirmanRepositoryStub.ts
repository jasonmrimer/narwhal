import AirmanRepository from './AirmanRepository';
import AirmanModelFactory from '../factories/AirmanModelFactory';

export default class AirmanRepositoryStub implements AirmanRepository {
  findAll() {
    return Promise.resolve(AirmanModelFactory.build());
  }

  findByUnit(id: number) {
    return Promise.resolve(AirmanModelFactory.buildForUnit(id));
  }
}