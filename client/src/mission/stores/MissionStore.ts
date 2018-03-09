import { computed, observable } from 'mobx';
import { MissionModel } from '../models/MissionModel';
import { MissionRepository } from '../repositories/MissionRepository';

export class MissionStore {
  private missionRepository: MissionRepository;

  @observable private _missions: MissionModel[] = [];
  @observable private _missionOptions: MissionModel[] = [];

  constructor(missionRepository: MissionRepository) {
    this.missionRepository = missionRepository;
  }

  async hydrate() {
    this._missions = await this.missionRepository.findAll();
    this._missionOptions = await this.missionRepository.findAllFromTodayOn();
  }

  @computed
  get missions() {
    return this._missions;
  }

  @computed
  get missionOptions() {
    return this._missionOptions.map(msn => {
      return {value: msn.missionId, label: msn.atoMissionNumber};
    });
  }
}