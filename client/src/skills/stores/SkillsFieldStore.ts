import { observable } from 'mobx';
import * as moment from 'moment';
import { Moment } from 'moment';
import { Skill } from '../models/Skill';

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

  timeToExpire(skill: Skill) {
    const diffPeriodicDue = skill.periodicDue.diff(moment(), 'days');
    const diffCurrencyExpiration = skill.currencyExpiration.diff(moment(), 'days');
    const realDiff = diffPeriodicDue > diffCurrencyExpiration ? diffCurrencyExpiration : diffPeriodicDue;

    if (realDiff === diffPeriodicDue) {
      return realDiff > 0 ?
        `Expires ${moment().to(skill.periodicDue)}` :
        `Expired ${moment().to(skill.periodicDue)}`;
    }
    return realDiff > 0 ?
      `Expires ${moment().to(skill.currencyExpiration)}` :
      `Expired ${moment().to(skill.currencyExpiration)}`;
  }

  isFlaggedForExpiration(skill: Skill) {
    return (
      this.isCloseToExpiration(skill.periodicDue) ||
      this.isExpired(skill.periodicDue) ||
      this.isCloseToExpiration(skill.currencyExpiration) ||
      this.isExpired(skill.currencyExpiration)
    );
  }
}