import { action, computed, observable } from 'mobx';
import { CrewModel } from '../models/CrewModel';
import { CrewRepository } from '../repositories/CrewRepository';

export class CrewStore {
  @observable private _crew: CrewModel | null = null;

  constructor(private repository: CrewRepository) {
  }

  @computed
  get crew() {
    return this._crew;
  }

  @action.bound
  async setCrewId(crewId: number) {
    this._crew = await this.repository.findOne(crewId);
  }

  @action.bound
  setCrewPositionTitle(positionId: number, titleValue: string) {
    if (this._crew) {
      const position = this._crew.crewPositions.find(pos => pos.id === positionId)!;
      position.title = titleValue;
      this._crew = Object.assign({}, this._crew);
    }
  }

  @action.bound
  async save() {
    if (this._crew) {
      this._crew = await this.repository.save(this._crew);
    }
  }
}