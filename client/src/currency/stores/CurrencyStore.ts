import { action, computed, observable } from 'mobx';
import { SkillFormStore } from '../../skills/stores/SkillFormStore';
import { Skill } from '../../skills/models/Skill';
import { AirmanRipItemFormStore } from '../../rip-items/stores/AirmanRipItemFormStore';
import { CertificationModel } from '../../skills/models/CertificationModel';
import { QualificationModel } from '../../skills/models/QualificationModel';
import { Repositories } from '../../utils/Repositories';

export enum CurrencyChild {
  SkillList,
  SkillForm,
  RipItemForm
}

interface AirmenRefresher {
  refreshAirmen: (item: {airmanId: number}) => Promise<void>;
}

export interface SiteIdContainer {
  selectedSite: number;
}

export class CurrencyStore {
  public airmanRipItemFormStore: AirmanRipItemFormStore;
  public skillFormStore: SkillFormStore;
  @observable private _child: CurrencyChild = CurrencyChild.SkillList;

  constructor(
    private airmenRefresher: AirmenRefresher,
    siteIdContainer: SiteIdContainer,
    private repositories: Repositories
  ) {
    this.airmanRipItemFormStore = new AirmanRipItemFormStore(this, repositories.ripItemRepository);
    this.skillFormStore = new SkillFormStore(siteIdContainer, this);
  }

  hydrate(certifications: CertificationModel[], qualifications: QualificationModel[]) {
    this.skillFormStore.hydrate(certifications, qualifications);
  }

  @computed
  get currencyChild() {
    return this._child;
  }

  @action.bound
  openCreateSkillForm() {
    this._child = CurrencyChild.SkillForm;
    return this.skillFormStore.open();
  }

  @action.bound
  openEditSkillForm(skill: Skill) {
    this._child = CurrencyChild.SkillForm;
    return this.skillFormStore.open(skill);
  }

  @action.bound
  closeSkillForm() {
    this._child = CurrencyChild.SkillList;
    this.skillFormStore.close();
  }

  @action.bound
  openAirmanRipItemForm() {
    this._child = CurrencyChild.RipItemForm;
  }

  @action.bound
  closeAirmanRipItemForm() {
    this._child = CurrencyChild.SkillList;
  }

  @action.bound
  async addSkill(skill: Skill) {
    try {
      await this.repositories.airmanRepository.saveSkill(skill);
      await this.airmenRefresher.refreshAirmen(skill);
    } catch (e) {
      this.setFormErrors(e);
    }
  }

  @action.bound
  async removeSkill(skill: Skill) {
    try {
      await this.repositories.airmanRepository.deleteSkill(skill);
      await this.airmenRefresher.refreshAirmen(skill);
    } catch (e) {
      this.setFormErrors(e);
    }
  }

  setFormErrors(errors: object[]) {
    this.skillFormStore.setErrors(errors);
  }
}
