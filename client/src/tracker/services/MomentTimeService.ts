import { TimeService } from './TimeService';
import * as moment from 'moment';
import { Moment } from 'moment';

export class MomentTimeService implements TimeService {
  getCurrentWeek(): Moment[] {
    const sunday = moment().startOf('week');
    return this.createWeek(sunday);
  }

  getCurrentTimeSpan(): moment.Moment[] {
    const sunday = moment().startOf('week');
    return this.createTimeSpan(sunday);
  }

  incrementWeek(week: Moment[]): Moment[] {
    const sunday = week[0].clone().startOf('week').add(7, 'day');
    return this.createWeek(sunday);
  }

  incrementWeekByDay(week: Moment[]): Moment[] {
    return this.createWeek(week[1].startOf('day'));
  }

  incrementTimeSpanByDay(timeSpan: moment.Moment[]): moment.Moment[] {
    return this.createTimeSpan(timeSpan[1].startOf('day'));
  }

  decrementWeekByDay(week: Moment[]): Moment[] {
    return this.createWeek(week[0].clone().subtract(1, 'day').startOf('day'));
  }

  decrementTimeSpanByDay(timeSpan: moment.Moment[]): moment.Moment[] {
    return this.createTimeSpan(timeSpan[0].clone().subtract(1, 'day').startOf('day'));
  }

  decrementWeek(week: Moment[]): Moment[] {
    const sunday = week[0].clone().startOf('week').subtract(7, 'day');
    return this.createWeek(sunday);
  }

  navigateToWeek(date: Moment) {
    const sunday = date.clone().startOf('week');
    return this.createWeek(sunday);
  }

  private createWeek(startOfWeek: Moment) {
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

  private createTimeSpan(startOfTimeSpan: Moment) {
    return [
      startOfTimeSpan,
      startOfTimeSpan.clone().add(1, 'day'),
      startOfTimeSpan.clone().add(2, 'day'),
      startOfTimeSpan.clone().add(3, 'day'),
      startOfTimeSpan.clone().add(4, 'day'),
      startOfTimeSpan.clone().add(5, 'day'),
      startOfTimeSpan.clone().add(6, 'day'),
      startOfTimeSpan.clone().add(7, 'day'),
      startOfTimeSpan.clone().add(8, 'day'),
      startOfTimeSpan.clone().add(9, 'day'),
      startOfTimeSpan.clone().add(10, 'day'),
      startOfTimeSpan.clone().add(11, 'day'),
      startOfTimeSpan.clone().add(12, 'day'),
      startOfTimeSpan.clone().add(13, 'day').endOf('day')
    ];
  }
}