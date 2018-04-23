import { action, computed, observable } from 'mobx';
import { Skill } from '../../skills/models/Skill';
import { AirmanRipItemModel } from '../../airman/models/AirmanRipItemModel';
import { Repositories } from '../../utils/Repositories';
import { AirmanRepository } from '../../airman/repositories/AirmanRepository';
import { RipItemRepository } from '../../airman/repositories/AirmanRipItemRepository';

export enum CurrencyChild {
  SkillList,
  SkillForm,
  RipItemForm
}

export class CurrencyStore {
  @observable private _child: CurrencyChild = CurrencyChild.SkillList;
  @observable private _airmanRipItems: AirmanRipItemModel[] = [];
  @observable private _pendingDeleteSkill: Skill | null = null;
  private airmanRepository: AirmanRepository;
  private ripItemRepository: RipItemRepository;

  constructor({airmanRepository, ripItemRepository}: Partial<Repositories>) {
    this.airmanRepository = airmanRepository!;
    this.ripItemRepository = ripItemRepository!;
  }

  @computed
  get currencyChild() {
    return this._child;
  }

  @computed
  get airmanRipItems() {
    return this._airmanRipItems;
  }

  @action.bound
  openCreateSkillForm() {
    this._child = CurrencyChild.SkillForm;
  }

  @action.bound
  openEditSkillForm() {
    this._child = CurrencyChild.SkillForm;
  }

  @action.bound
  closeSkillForm() {
    this._child = CurrencyChild.SkillList;
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
    await this.airmanRepository.saveSkill(skill);
  }

  @action.bound
  removeSkill(skill: Skill) {
    this._pendingDeleteSkill = skill;
  }

  @action.bound
  cancelPendingDelete() {
    this._pendingDeleteSkill = null;
  }

  @action.bound
  async executePendingDelete() {
    if (this._pendingDeleteSkill == null) {
      return;
    }
    await this.airmanRepository.deleteSkill(this._pendingDeleteSkill);
    this._pendingDeleteSkill = null;
  }

  @computed
  get pendingDeleteSkill() {
    return this._pendingDeleteSkill;
  }

  @action.bound
  async setRipItemsForAirman(airmanId: number) {
    this._airmanRipItems = await this.ripItemRepository.findBySelectedAirman(airmanId);
  }

  @computed
  get expiredItemCount() {
    return this._airmanRipItems
      .filter(item => item.isExpired)
      .length;
  }

  @computed
  get assignedItemCount() {
    return this._airmanRipItems
      .filter(item => item.expirationDate != null && item.expirationDate.isValid())
      .length;
  }
}
