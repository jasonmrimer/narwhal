import CrewModelFactory from '../../factories/CrewModelFactory';
import CrewRepository from '../CrewRepository';
import CrewModel from '../../model/CrewModel';

const crews = [
  CrewModelFactory.build(1, 1),
  CrewModelFactory.build(2, 1),
  CrewModelFactory.build(3, 2),
  CrewModelFactory.build(4, 2)
];

export default class CrewRepositoryStub implements CrewRepository {
  findAll(): Promise<CrewModel[]> {
    return Promise.resolve(crews);
  }

}
