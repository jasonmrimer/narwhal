import CrewRepository from '../CrewRepository';
import CrewModel from '../../model/CrewModel';

const crews = [
  new CrewModel(1, 1, 'SUPER CREW'),
  new CrewModel(2, 1, 'LAME CREW'),
  new CrewModel(3, 2, 'AMAZING CREW'),
  new CrewModel(4, 2, 'FUNNY CREW'),
  new CrewModel(5, 2, 'GREAT CREW'),
  new CrewModel(6, 3, 'GIANT CREW'),
  new CrewModel(7, 3, 'SMALL CREW'),
  new CrewModel(8, 4, 'FIRST CREW'),
  new CrewModel(9, 4, 'SECOND CREW'),
  new CrewModel(10, 4, 'THIRD CREW'),
];

export default class CrewRepositoryStub implements CrewRepository {
  findAll(): Promise<CrewModel[]> {
    return Promise.resolve(crews);
  }

}
