import { action, computed, observable } from 'mobx';
import { AirmanRipItemModel } from '../../airman/models/AirmanRipItemModel';
import { RipItemRepository } from '../../airman/repositories/AirmanRipItemRepository';

interface Closeable {
  closeAirmanRipItemForm(): void;
}

export class AirmanRipItemFormStore {
  @observable private _airmanRipItems: AirmanRipItemModel[] = [];

  constructor(private closeable: Closeable, public ripItemRepository: RipItemRepository) {
  }

  async hydrate(airmanId: number) {
    this._airmanRipItems = await this.ripItemRepository.findBySelectedAirman(airmanId);
  }

  @computed
  get ripItems() {
    return this._airmanRipItems;
  }

  @action.bound
  updateRipItem(item: AirmanRipItemModel) {
    const index = this._airmanRipItems.findIndex(i => i.id === item.id)!;
    this._airmanRipItems[index] = item;
    this._airmanRipItems = this._airmanRipItems.slice();
  }

  @action.bound
  async submitRipItems() {
    this._airmanRipItems = await this.ripItemRepository.updateAirmanRipItems(this._airmanRipItems);
    this.closeable.closeAirmanRipItemForm();
  }
}