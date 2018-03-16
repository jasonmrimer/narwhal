import { action, computed, observable } from 'mobx';
import { SkillFormStore } from '../../skills/stores/SkillFormStore';
import { Skill } from '../../skills/models/Skill';
import { AirmanRipItemFormStore } from '../../rip-items/stores/AirmanRipItemFormStore';
import { RipItemRepository } from '../../airman/repositories/AirmanRipItemRepository';

export enum CurrencyChild {
  SkillList,
  SkillForm,
  RipItemForm
}

export class CurrencyStore {
  public airmanRipItemFormStore: AirmanRipItemFormStore;
  @observable private _child: CurrencyChild = CurrencyChild.SkillList;

  constructor(public skillFormStore: SkillFormStore, ripItemRepository: RipItemRepository) {
    this.airmanRipItemFormStore = new AirmanRipItemFormStore(this, ripItemRepository);
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

  setFormErrors(errors: object[]) {
    this.skillFormStore.setErrors(errors);
  }
}
