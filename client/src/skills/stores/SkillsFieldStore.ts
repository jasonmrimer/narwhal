import { observable } from 'mobx';
import * as moment from 'moment';
import { Moment } from 'moment';

export class SkillsFieldStore {
  @observable
  isCloseToExpiration(expirationDate: Moment, currentDate?: Moment | undefined) {
    if (currentDate === undefined) {
      currentDate = moment();
    }
    return !this.isExpired(expirationDate, currentDate) &&
    expirationDate.isBefore(currentDate.add(14, 'days'));
  }

  isExpired(expirationDate: Moment, currentDate?: Moment | undefined) {
    if (currentDate === undefined) {
      currentDate = moment();
    }
    return currentDate.isAfter(expirationDate);
  }
}