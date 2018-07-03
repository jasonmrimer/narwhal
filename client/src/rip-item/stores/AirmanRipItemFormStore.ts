import { action, computed, observable } from 'mobx';
import { AirmanRipItemModel } from '../../airman/models/AirmanRipItemModel';
import { RipItemRepository } from '../../airman/repositories/AirmanRipItemRepository';
import { Moment } from 'moment';
import { NotificationStore } from '../../widgets/stores/NotificationStore';

export class AirmanRipItemFormStore extends NotificationStore {
  @observable private _airmanRipItems: AirmanRipItemModel[] = [];

  constructor(private ripItemRepository: RipItemRepository) {
    super();
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
  updateRipItem(id: number, expirationDate: Moment | null) {
    const item = this._airmanRipItems.find((i: AirmanRipItemModel) => i.id === id);
    if (item) {
      item.expirationDate = expirationDate;
    }
  }

  @action.bound
  updateAllRipItems(expirationDate: Moment | null) {
    this._airmanRipItems.forEach((item: AirmanRipItemModel) => item.expirationDate = expirationDate);
  }

  @action.bound
  async submitRipItems() {
    this._airmanRipItems = await this.ripItemRepository.updateAirmanRipItems(this._airmanRipItems);
  }

  @computed
  get expiredItemCount() {
    return this._airmanRipItems
      .filter(item => item.isAboutToExpire)
      .length;
  }

  @computed
  get assignedItemCount() {
    return this._airmanRipItems
      .filter(item => item.expirationDate != null && item.expirationDate.isValid())
      .length;
  }
}