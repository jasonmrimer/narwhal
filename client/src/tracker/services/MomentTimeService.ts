import { TimeService } from './TimeService';
import * as moment from 'moment';
import { Moment } from 'moment';

export class MomentTimeService implements TimeService {
  getCurrentWeek(): Moment[] {
    const sunday = moment().startOf('week');
    return this.createWeek(sunday);
  }

  incrementWeek(week: Moment[]): Moment[] {
    const sunday = week[0].clone().startOf('week').add(7, 'day');
    return this.createWeek(sunday);
  }

  decrementWeek(week: moment.Moment[]): moment.Moment[] {
    const sunday = week[0].clone().startOf('week').subtract(7, 'day');
    return this.createWeek(sunday);
  }

  navigateToWeek(date: Moment) {
    const sunday = date.clone().startOf('week');
    return this.createWeek(sunday);
  }

  createWeek(sunday: Moment) {
    return [
      sunday,
      sunday.clone().add(1, 'day'),
      sunday.clone().add(2, 'day'),
      sunday.clone().add(3, 'day'),
      sunday.clone().add(4, 'day'),
      sunday.clone().add(5, 'day'),
      sunday.clone().add(6, 'day').endOf('day')
    ];
  }
}