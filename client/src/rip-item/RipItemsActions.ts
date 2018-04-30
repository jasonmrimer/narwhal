import { Moment } from 'moment';
import { stores } from '../stores';
import { AirmanRipItemModel } from '../airman/models/AirmanRipItemModel';

export class RipItemsActions {
  static handleChange = (expirationDate: Moment, item: AirmanRipItemModel) => {
    item.expirationDate = expirationDate.isValid() ? expirationDate : null;
    stores.airmanRipItemFormStore.updateRipItem(item);
  }

  static submit = async () => {
    await stores.airmanRipItemFormStore.submitRipItems();
    stores.currencyStore.closeAirmanRipItemForm();
  }
}