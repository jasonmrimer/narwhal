import { CrewRepository } from '../CrewRepository';
import { CrewModel } from '../../models/CrewModel';
import { CrewModelFactory } from '../../factories/CrewModelFactory';

export class CrewRepositorySpy implements CrewRepository {
  constructor(private crew: CrewModel = CrewModelFactory.build()) {
  }

  findOne(id: number) {
    return Promise.resolve(this.crew);
  }

  setCrew(crewModel: CrewModel) {
    this.crew = crewModel;
  }
}
