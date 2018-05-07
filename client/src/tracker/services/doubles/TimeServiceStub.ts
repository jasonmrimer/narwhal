import * as moment from 'moment';
import { Moment } from 'moment';
import { TimeService } from '../TimeService';

export class TimeServiceStub implements TimeService {
   getCurrentWeek(): Moment[] {
    return [
      moment('2017-11-26'),
      moment('2017-11-27'),
      moment('2017-11-28'),
      moment('2017-11-29'),
      moment('2017-11-30'),
      moment('2017-12-01'),
      moment('2017-12-02')
    ];
  }

  incrementWeek(week: Moment[]): Moment[] {
    const sunday = week[0].clone().startOf('week').add(7, 'day');
    return this.createWeek(sunday);
  }

  incrementWeekByDay(week: Moment[]): Moment[] {
    return this.createWeek(week[1].startOf('day'));
  }

  decrementWeekByDay(week: Moment[]): Moment[] {
    return this.createWeek(week[0].clone().subtract(1, 'day').startOf('day'));
  }

  decrementWeek(week: Moment[]): Moment[] {
    const sunday = week[0].clone().startOf('week').subtract(7, 'day');
    return this.createWeek(sunday);
  }

  navigateToWeek(date: Moment) {
    const sunday = date.clone().startOf('week');
    return this.createWeek(sunday);
  }

  createWeek(startOfWeek: Moment) {
    return [
      startOfWeek,
      startOfWeek.clone().add(1, 'day'),
      startOfWeek.clone().add(2, 'day'),
      startOfWeek.clone().add(3, 'day'),
      startOfWeek.clone().add(4, 'day'),
      startOfWeek.clone().add(5, 'day'),
      startOfWeek.clone().add(6, 'day').endOf('day')
    ];
  }
}