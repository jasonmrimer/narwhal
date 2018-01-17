import { action, computed, observable } from 'mobx';
import SquadronModel from './models/SquadronModel';
import SquadronRepository from './repositories/SquadronRepository';
import { FilterableStore } from '../stores/FilterableStore';

export class SquadronStore implements FilterableStore {
  @observable private selectedSquadronId: number = -1;
  @observable private _squadrons: SquadronModel[] = [];

  constructor(private repository: SquadronRepository) {
  }

  @action
  async fetchAllSquadrons() {
    this._squadrons = await this.repository.findAll();
  }

  @action
  filterBySquadronId(id: number) {
    this.selectedSquadronId = id;
  }

  @computed
  get squadrons() {
    return this._squadrons;
  }

  @computed
  get selectedId() {
    return this.selectedSquadronId;
  }

  @action
  setSelectedSquadronId(id: number) {
    this.selectedSquadronId = id;
  }

  @computed
  get currentOptionId() {
    return this.selectedSquadronId;
  }

  @computed
  get options() {
    return this._squadrons.map((squadron: SquadronModel) => {
      return {value: squadron.id, label: squadron.name};
    });
  }

  get isDisabled() {
    return false;
  }
}