import { action, computed, observable } from 'mobx';
import { SkillFormStore } from '../../skills/stores/SkillFormStore';
import { Skill } from '../../skills/models/Skill';

export class CurrencyStore {
  @observable private _shouldShowSkillForm: boolean = false;

  constructor(public skillFormStore: SkillFormStore) {
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
    this._shouldShowSkillForm = true;
  }

  @action.bound
  openCreateSkillForm() {
    this._shouldShowSkillForm = true;
    return this.skillFormStore.open();
  }

  @action.bound
  openEditSkillForm(skill: Skill) {
    this._shouldShowSkillForm = true;
    return this.skillFormStore.open(skill);
  }

  @action.bound
  closeSkillForm() {
    this._shouldShowSkillForm = false;
    this.skillFormStore.close();
  }

  setFormErrors(errors: object[]) {
    this.skillFormStore.setErrors(errors);
  }
}
