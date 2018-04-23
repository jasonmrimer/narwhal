import { action, computed, observable } from 'mobx';
import { CrewModel } from '../models/CrewModel';
import { CrewPositionModel } from '../models/CrewPositionModel';
import { AirmanModel } from '../../airman/models/AirmanModel';
import { Repositories } from '../../utils/Repositories';
import { CrewPositionRepository } from '../repositories/CrewPositionRepository';

export interface NewEntry {
  airmanName: string;
  title: string;
  critical: boolean;
}

export class CrewStore {
  private crewPositionRepository: CrewPositionRepository;
  private pendingDeletePositions: CrewPositionModel[] = [];

  @observable private _crew: CrewModel | null = null;
  @observable private _airmen: AirmanModel[] = [];
  @observable private _newEntry: NewEntry = {airmanName: '', title: '', critical: false};

  constructor(repositories: Repositories) {
    this.crewPositionRepository = repositories.crewPositionRepository;
  }

  hydrate(c: CrewModel, airmen: AirmanModel[]) {
    this._crew = c;
    this._airmen = airmen;
  }

  @computed
  get airmen() {
    return this._airmen;
  }

  @computed
  get airmenOptions() {
    const airmenIds = this._crew!.crewPositions.map(({airman}) => airman.id);

    return this._airmen.filter((airman) => {
      return airmenIds.indexOf(airman.id) === -1;
    }).map((airman) => {
      return {value: airman.id, label: `${airman.lastName}, ${airman.firstName}`};
    });
  }

  @computed
  get crew() {
    return this._crew;
  }

  @action.bound
  setCrewEntry(entryId: number, property: Partial<CrewPositionModel>) {
    if (this._crew == null) {
      return;
    }

    const positions = this._crew.crewPositions;
    const index = positions.findIndex(pos => pos.id === entryId);
    if (index === -1) {
      return;
    }

    Object.assign(positions[index], property);
  }

  @computed
  get newEntry() {
    return this._newEntry;
  }

  @action
  setNewEntry(property: any) {
    Object.assign(this._newEntry, property);
  }

  @action.bound
  async save() {
    if (this._crew == null) {
      return;
    }

    if (this.pendingDeletePositions.length > 0) {
      await this.crewPositionRepository.delete(this.pendingDeletePositions);
      this.pendingDeletePositions = [];
    }

    const name = this._newEntry.airmanName.split(', ');
    const airman = this._airmen.find((a) => a.lastName === name[0] && a.firstName === name[1]);

    if (airman) {
      this._crew.crewPositions.push(
        new CrewPositionModel(
          airman,
          this._newEntry.title,
          this._newEntry.critical
        ));
      this._newEntry = {airmanName: '', title: '', critical: false};
    }

    this._crew =
      await this.crewPositionRepository.update(this._crew.crewPositions, this._crew.mission.id);
  }

  @action.bound
  clearPosition(id: number) {
    const crewPosition = this._crew!.crewPositions.find(crewPos => crewPos.id === id);
    this.pendingDeletePositions.push(crewPosition!);

    const crewPositionIndex = this._crew!.crewPositions.findIndex(crewPos => crewPos.id === id);
    this._crew!.crewPositions.splice(crewPositionIndex, 1);
  }
}