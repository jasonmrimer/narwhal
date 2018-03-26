import { CrewRepository } from '../CrewRepository';
import { CrewModel } from '../../models/CrewModel';
import { CrewModelFactory } from '../../factories/CrewModelFactory';

export class CrewRepositorySpy implements CrewRepository {
  constructor(private crew: CrewModel = CrewModelFactory.build(),
              public saveCalls: CrewModel[] = []) {
  }

  findOne(id: number) {
    return Promise.resolve(this.crew);
  }

  update(crew: CrewModel): Promise<CrewModel> {
    this.saveCalls.push(crew);
    return Promise.resolve(crew);
  }

  setCrew(crewModel: CrewModel) {
    this.crew = crewModel;
  }
}
