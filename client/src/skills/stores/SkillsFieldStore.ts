import { observable } from 'mobx';
import * as moment from 'moment';
import { Moment } from 'moment';

export class SkillsFieldStore {
  @observable
  periodicDueIsCloseToExpiration(periodicDue: Moment, currentDate?: Moment | undefined) {
    if (currentDate === undefined) {
      currentDate = moment();
    }
    return !this.isExpired(periodicDue, currentDate) &&
    periodicDue.isBefore(currentDate.clone().add(14, 'days'));
  }

  isExpired(expirationDate: Moment, currentDate?: Moment | undefined) {
    if (currentDate === undefined) {
      currentDate = moment();
    }
    return currentDate.isAfter(expirationDate);
  }
}