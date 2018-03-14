import { action, computed, observable } from 'mobx';
import { SkillFormStore } from '../../skills/stores/SkillFormStore';
import { Skill } from '../../skills/models/Skill';
import { RipItemModel } from '../../rip-items/models/RipItemModel';
import { RipItemRepository } from '../../rip-items/repositories/RipItemRepository';

export class CurrencyStore {
  @observable private _shouldShowSkillForm: boolean = false;
  @observable private _shouldShowRipItems: boolean = false;
  @observable private _ripItems: RipItemModel[] = [];

  constructor(public skillFormStore: SkillFormStore, public ripItemRepository: RipItemRepository) {
  }

  async hydrate() {
    this._ripItems = await this.ripItemRepository.findAll();
  }

  @computed
  get ripItems() {
    return this._ripItems;
  }

  @computed
  get hasItem() {
    return this.skillFormStore.hasItem;
  }

  @computed
  get shouldShowSkillForm() {
    return this._shouldShowSkillForm;
  }

  @action.bound
  showSkillForm() {
    this._shouldShowRipItems = false;
    this._shouldShowSkillForm = true;
  }

  @action.bound
  openCreateSkillForm() {
    this._shouldShowRipItems = false;
    this._shouldShowSkillForm = true;
    return this.skillFormStore.open();
  }

  @action.bound
  openEditSkillForm(skill: Skill) {
    this._shouldShowRipItems = false;
    this._shouldShowSkillForm = true;
    return this.skillFormStore.open(skill);
  }

  @action.bound
  closeSkillForm() {
    this._shouldShowRipItems = false;
    this._shouldShowSkillForm = false;
    this.skillFormStore.close();
  }

  @action.bound
  showRipItems() {
    this._shouldShowSkillForm = false;
    this._shouldShowRipItems = true;
  }

  @computed
  get shouldShowRipItems() {
    return this._shouldShowRipItems;
  }

  setFormErrors(errors: object[]) {
    this.skillFormStore.setErrors(errors);
  }
}
