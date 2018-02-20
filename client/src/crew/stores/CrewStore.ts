import { action, computed, observable } from 'mobx';
import { CrewModel } from '../models/CrewModel';
import { CrewRepository } from '../repositories/CrewRepository';

export class CrewStore {
  @observable private _crew: CrewModel | null = null;

  constructor(private repository: CrewRepository) {

  }

  @action.bound
  async setCrewId(crewId: number) {
    this._crew = await this.repository.findOne(crewId);
  }

  @computed
  get crew() {
    return this._crew;
  }
}