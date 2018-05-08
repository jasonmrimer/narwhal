import { Moment } from 'moment';
import { Stores } from '../stores';
import { AirmanRipItemModel } from '../airman/models/AirmanRipItemModel';

export class RipItemsActions {
  constructor(private stores: Partial<Stores>) {}

  handleChange = (expirationDate: Moment, item: AirmanRipItemModel) => {
    item.expirationDate = expirationDate.isValid() ? expirationDate : null;
    this.stores.airmanRipItemFormStore!.updateRipItem(item);
  }

  submit = async () => {
    await this.stores.airmanRipItemFormStore!.submitRipItems();
    this.stores.currencyStore!.closeAirmanRipItemForm();
  }
}