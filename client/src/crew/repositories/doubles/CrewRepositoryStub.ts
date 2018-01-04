import CrewRepository from '../CrewRepository';
import CrewModel from '../../model/CrewModel';

export default class CrewRepositoryStub implements CrewRepository {
  findAll(): Promise<CrewModel[]> {
    return Promise.resolve([new CrewModel(1, 'SUPER CREW')]);
  }

}
