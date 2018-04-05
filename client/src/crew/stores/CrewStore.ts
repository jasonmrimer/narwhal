import { action, computed, observable } from 'mobx';
import { CrewModel } from '../models/CrewModel';
import { CrewRepository } from '../repositories/CrewRepository';
import { CrewPositionModel } from '../models/CrewPositionModel';
import { AirmanRepository } from '../../airman/repositories/AirmanRepository';
import { AirmanModel } from '../../airman/models/AirmanModel';
import { Repositories } from '../../Repositories';
import { ProfileSitePickerStore } from '../../profile/stores/ProfileSitePickerStore';
import { CrewPositionRepository } from '../repositories/CrewPositionRepository';

interface NewEntry {
  airmanName: string;
  title: string;
  critical: boolean;
}

export class CrewStore {
  private airmanRepository: AirmanRepository;
  private crewRepository: CrewRepository;
  private crewPositionRepository: CrewPositionRepository;
  private pendingDeletePositions: CrewPositionModel[] = [];

  @observable private _crew: CrewModel | null = null;
  @observable private _airmen: AirmanModel[] = [];
  @observable private _newEntry: NewEntry = {airmanName: '', title: '', critical: false};
  @observable private _loading: boolean = false;

  constructor(repositories: Repositories, private _profileStore: ProfileSitePickerStore) {
    this.airmanRepository = repositories.airmanRepository;
    this.crewRepository = repositories.crewRepository;
    this.crewPositionRepository = repositories.crewPositionRepository;
  }

  async hydrate(crewId: number) {
    this._loading = true;

    const [airmen, crew] = await Promise.all([
      this.airmanRepository.findBySiteId(this._profileStore.profile!.user.siteId!),
      this.crewRepository.findOne(crewId)
    ]);
    this._airmen = airmen;
    this._crew = crew;

    this._loading = false;
  }

  @computed
  get loading() {
    return this._loading;
  }

  @action.bound
  setLoading(loading: boolean) {
    this._loading = loading;
  }

  @computed
  get airmen() {
    return this._airmen;
  }

  @computed
  get airmenOptions() {
    return this._airmen.map((airman) => {
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
      this._crew.crewPositions.push(new CrewPositionModel(airman, this._newEntry.title, this._newEntry.critical));
      this._newEntry = {airmanName: '', title: '', critical: false};
    }

    this._crew.crewPositions =
      await this.crewPositionRepository.update(this._crew.crewPositions, this._crew.mission.id);
  }

  @computed
  get profileStore() {
    return this._profileStore;
  }

  @action.bound
  clearPosition(id: number) {
    const crewPosition = this._crew!.crewPositions.find(crewPos => crewPos.id === id);
    this.pendingDeletePositions.push(crewPosition!);

    const crewPositionIndex = this._crew!.crewPositions.findIndex(crewPos => crewPos.id === id);
    this._crew!.crewPositions.splice(crewPositionIndex, 1);
  }
}