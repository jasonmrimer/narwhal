import { action, computed, observable } from 'mobx';
import { CrewModel } from '../models/CrewModel';
import { CrewRepository } from '../repositories/CrewRepository';
import { CrewPositionModel } from '../models/CrewPositionModel';

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
  setCrewPosition(positionId: number, property: Partial<CrewPositionModel>) {
    if (this._crew) {
      let position = this._crew.crewPositions.find(pos => pos.id === positionId)!;
      Object.assign(position, property);

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