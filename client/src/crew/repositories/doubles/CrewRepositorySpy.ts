import { CrewRepository } from '../CrewRepository';
import { CrewModel } from '../../models/CrewModel';
import { CrewModelFactory } from '../../factories/CrewModelFactory';
import { EventModel } from '../../../event/models/EventModel';

export class CrewRepositorySpy implements CrewRepository {
  constructor(private crew: CrewModel = CrewModelFactory.build()) {
  }

  findOne(id: number) {
    return Promise.resolve(this.crew);
  }

  save(event: EventModel): Promise<EventModel> {
    return Promise.resolve(event);
  }
}
