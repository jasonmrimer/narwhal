import { action, computed, observable } from 'mobx';
import { AirmanModel } from '../../airman/models/AirmanModel';
import { Repositories } from '../../utils/Repositories';
import { ProfileSitePickerStore } from '../../profile/stores/ProfileSitePickerStore';
import { AirmanRepository } from '../../airman/repositories/AirmanRepository';
import { CrewStore } from './CrewStore';
import { RosterHeaderStore, SiteIdContainer } from '../../roster/stores/RosterHeaderStore';
import SkillRepository from '../../skills/repositories/SkillRepository';
import { AllAirmenRefresher, LocationFilterStore } from '../../widgets/stores/LocationFilterStore';
import { SiteRepository } from '../../site/repositories/SiteRepository';
import { CrewRepository } from '../repositories/CrewRepository';

export class MissionPlannerStore implements AllAirmenRefresher, SiteIdContainer {
  public crewStore: CrewStore;
  public rosterHeaderStore: RosterHeaderStore;
  public locationFilterStore: LocationFilterStore;

  @observable private _loading: boolean = false;
  @observable private _airmen: AirmanModel[] = [];

  private airmanRepository: AirmanRepository;
  private skillRepository: SkillRepository;
  private siteRepository: SiteRepository;
  private crewRepository: CrewRepository;

  constructor(repositories: Repositories, private _profileStore: ProfileSitePickerStore) {
    this.airmanRepository = repositories.airmanRepository;
    this.skillRepository = repositories.skillRepository;
    this.siteRepository = repositories.siteRepository;
    this.crewRepository = repositories.crewRepository;

    this.rosterHeaderStore = new RosterHeaderStore(this);
    this.locationFilterStore = new LocationFilterStore(this);
    this.crewStore = new CrewStore(repositories);
  }

  @action.bound
  async hydrate(crewId: number) {
    this._loading = true;

    const [qualifications, certifications, sites, crew, airmen] = await Promise.all([
      this.skillRepository.findAllQualifications(),
      this.skillRepository.findAllCertifications(),
      this.siteRepository.findAll(),
      this.crewRepository.findOne(crewId),
      this.airmanRepository.findBySiteId(this.selectedSite)
    ]);

    this._airmen = airmen;

    this.rosterHeaderStore.hydrate(certifications, qualifications);
    this.locationFilterStore.hydrate(this.selectedSite, sites);
    this.crewStore.hydrate(crew, airmen);

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

  get selectedSite() {
    return this._profileStore.profile!.user.siteId!;
  }

  async refreshAllAirmen() {
    this._airmen = await this.airmanRepository.findBySiteId(this.locationFilterStore.selectedSite);
  }
}
