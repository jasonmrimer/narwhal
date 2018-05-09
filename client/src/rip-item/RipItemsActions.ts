import { Moment } from 'moment';
import { Stores } from '../app/stores';

export class RipItemsActions {
  constructor(private stores: Partial<Stores>) {
  }

  updateRipItem = (id: number, expirationDate: Moment) => {
    this.stores.airmanRipItemFormStore!.updateRipItem(
      id,
      expirationDate.isValid() ? expirationDate : null
    );
  }

  updateAllRipItems = (expirationDate: Moment) => {
    this.stores.airmanRipItemFormStore!.updateAllRipItems(
      expirationDate.isValid() ? expirationDate : null
    );
  }

  submit = async () => {
    await this.stores.airmanRipItemFormStore!.submitRipItems();
    this.stores.currencyStore!.closeAirmanRipItemForm();
  }
}