import { Stores } from '../../app/stores';
import { AdminSquadronStore } from '../stores/AdminSquadronStore';
import { AdminSquadronModel } from '../models/AdminSquadronModel';
import { action, computed } from 'mobx';
import { AdminSiteRepository } from '../repositories/AdminSiteRepository';
import { Repositories } from '../../utils/Repositories';
import { FilterOption } from '../../widgets/inputs/FilterOptionModel';
import { AdminSquadronRepository } from '../repositories/AdminSquadronRepository';

export class AdminSquadronActions {
  private adminSquadronStore: AdminSquadronStore;
  private adminSiteRepository: AdminSiteRepository;
  private adminSquadronRepository: AdminSquadronRepository;

  constructor(stores: Partial<Stores>, repositories: Partial<Repositories>) {
    this.adminSiteRepository = repositories.adminSiteRepository!;
    this.adminSquadronRepository = repositories.adminSquadronRepository!;
    this.adminSquadronStore = stores.adminSquadronStore!;
  }

  @action.bound
  async showAddSquadron() {
    this.adminSquadronStore.setSites(await this.adminSiteRepository.findAll());
    this.adminSquadronStore.setPendingSquadron(new AdminSquadronModel());
  }

  @action.bound
  async hideAddSquadron() {
    this.adminSquadronStore.defaultPendingSquadron();
  }

  @action.bound
  async confirmAddSquadron() {
    const squadron = await this.adminSquadronRepository.saveSquadron(this.adminSquadronStore!.pendingSquadron!);
    this.adminSquadronStore.squadrons.push(squadron);
    this.hideAddSquadron();
  }

  @action.bound
  onSquadronNameChange(name: string) {
    this.adminSquadronStore.pendingSquadron!.setSquadronName(name);
  }

  @action.bound
  onSquadronSiteChange(site: FilterOption) {
    this.adminSquadronStore.pendingSquadron!.setSiteId(Number(site.value));
    this.adminSquadronStore.pendingSquadron!.setSiteName(site.label);
  }

  get performLoading() {
    return this.adminSquadronStore.performLoading;
  }

  @computed
  get pendingSquadronName() {
    return this.adminSquadronStore.pendingSquadron!.squadronName!;
  }

  @computed
  get siteOptions() {
    return this.adminSquadronStore.sites.map(s => ({value: Number(s.siteId), label: s.siteName}));
  }

  @computed
  get selectedSite() {
    return this.siteOptions.find(s => s.value === this.adminSquadronStore.pendingSquadron!.siteId);
  }
}