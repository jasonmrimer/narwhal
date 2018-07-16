import { observable } from 'mobx';
import * as moment from 'moment';
import { Moment } from 'moment';

export class SkillsFieldStore {
  @observable
  isCloseToExpiration(date: Moment, currentDate?: Moment | undefined) {
    if (currentDate === undefined) {
      currentDate = moment();
    }
    return !this.isExpired(date, currentDate) &&
    date.isBefore(currentDate.clone().add(14, 'days'));
  }

  isExpired(date: Moment, currentDate?: Moment | undefined) {
    if (currentDate === undefined) {
      currentDate = moment();
    }
    return currentDate.isAfter(date);
  }
}