import { action, computed, observable } from 'mobx';
import { AirmanModel } from '../../airman/models/AirmanModel';
import { Repositories } from '../../Repositories';
import { ProfileSitePickerStore } from '../../profile/stores/ProfileSitePickerStore';
import { AirmanRepository } from '../../airman/repositories/AirmanRepository';
import { CrewStore } from './CrewStore';
import { RosterHeaderStore } from '../../roster/stores/RosterHeaderStore';
import SkillRepository from '../../skills/repositories/SkillRepository';
import { LocationFilterStore } from '../../widgets/stores/LocationFilterStore';
import { SiteRepository } from '../../site/repositories/SiteRepository';

export class MissionPlannerStore {
  public crewStore: CrewStore;
  public rosterHeaderStore: RosterHeaderStore;
  public locationFilterStore: LocationFilterStore;

  @observable private _loading: boolean = false;
  @observable private _airmen: AirmanModel[];

  private airmanRepository: AirmanRepository;
  private skillRepository: SkillRepository;
  private siteRepository: SiteRepository;

  constructor(repositories: Repositories, private _profileStore: ProfileSitePickerStore) {
    this.airmanRepository = repositories.airmanRepository;
    this.skillRepository = repositories.skillRepository;
    this.siteRepository = repositories.siteRepository;
    this.crewStore = new CrewStore(repositories, this._profileStore);
    this.locationFilterStore = new LocationFilterStore(this);
  }

  @action.bound
  async hydrate(crewId: number) {
    this._loading = true;

    const qualifications = await this.skillRepository.findAllQualifications();
    const certifications = await this.skillRepository.findAllCertifications();

    let siteId = this._profileStore.profile!.user.siteId!;
    this.rosterHeaderStore = new RosterHeaderStore({selectedSite: siteId});
    await this.rosterHeaderStore.hydrate(certifications, qualifications);

    const result = await this.airmanRepository.findBySiteId(siteId);
    this._airmen = result.filter((airman) => airman.siteId === siteId);

    await this.crewStore.hydrate(crewId, this._airmen);
    const sites = await this.siteRepository.findAll();
    await this.locationFilterStore.hydrate(siteId, sites);

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
  get filteredAirmen() {
    const airmen = this.locationFilterStore.filterAirmen(this._airmen);
    return this.rosterHeaderStore.filterAirmen(airmen);
  }

  async refreshAllAirmen() {
    this._airmen = await this.airmanRepository.findBySiteId(this.locationFilterStore.selectedSite);
  }
}
