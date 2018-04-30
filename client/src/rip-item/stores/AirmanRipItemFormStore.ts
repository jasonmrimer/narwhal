import { action, computed, observable } from 'mobx';
import { AirmanRipItemModel } from '../../airman/models/AirmanRipItemModel';
import { RipItemRepository } from '../../airman/repositories/AirmanRipItemRepository';

export class AirmanRipItemFormStore {
  @observable private _airmanRipItems: AirmanRipItemModel[] = [];

  constructor(private ripItemRepository: RipItemRepository) {
  }

  @action.bound
  setRipItems(airmanRipItems: AirmanRipItemModel[]) {
    this._airmanRipItems = airmanRipItems;
  }

  @computed
  get ripItems() {
    return this._airmanRipItems;
  }

  @action.bound
  updateRipItem(item: AirmanRipItemModel) {
    const index = this._airmanRipItems.findIndex(i => i.id === item.id)!;
    this._airmanRipItems.splice(index, 1, item);
  }

  @action.bound
  async submitRipItems() {
    this._airmanRipItems = await this.ripItemRepository.updateAirmanRipItems(this._airmanRipItems);
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