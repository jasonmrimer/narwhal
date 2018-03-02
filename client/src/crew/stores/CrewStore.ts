import { action, computed, observable } from 'mobx';
import { CrewModel } from '../models/CrewModel';
import { CrewRepository } from '../repositories/CrewRepository';
import { CrewPositionModel } from '../models/CrewPositionModel';
import { AirmanRepository } from '../../airman/repositories/AirmanRepository';
import { AirmanModel } from '../../airman/models/AirmanModel';

interface NewEntry {
  airmanName: string;
  title: string;
  critical: boolean;
}

export class CrewStore {
  @observable private _crew: CrewModel | null = null;
  @observable private _airmen: AirmanModel[] = [];
  @observable private _newEntry: NewEntry = {airmanName: '', title: '', critical: false};

  constructor(private crewRepository: CrewRepository,
              private airmanRepository: AirmanRepository) {
  }

  async hydrate(crewId: number) {
    const results = await Promise.all([
      this.airmanRepository.findAll(),
      this.crewRepository.findOne(crewId)
    ]);
    this._airmen = results[0];
    this._crew = results[1];
  }

  @computed
  get airmen() {
    return this._airmen;
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

    const name = this._newEntry.airmanName.split(', ');
    const airman = this._airmen.find((a) => a.lastName === name[0] && a.firstName === name[1]);
    if (airman) {
      this._crew.crewPositions.push(new CrewPositionModel(airman, this._newEntry.title, this._newEntry.critical));
      this._newEntry = {airmanName: '', title: '', critical: false};
    }

    this._crew = await this.crewRepository.update(this._crew);
  }
}