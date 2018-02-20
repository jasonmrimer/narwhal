import { CrewRepository } from '../CrewRepository';
import { CrewModel } from '../../models/CrewModel';

export class CrewRepositoryStub implements CrewRepository {
  constructor(private crew: CrewModel) {
  }

  findOne(id: number) {
    return Promise.resolve(this.crew);
  }
}
