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
      moment('2017-12-02').endOf('day'),
    ];
  }

  getCurrentTimeSpan(): moment.Moment[] {
    return [
      moment('2017-11-26'),
      moment('2017-11-27'),
      moment('2017-11-28'),
      moment('2017-11-29'),
      moment('2017-11-30'),
      moment('2017-12-01'),
      moment('2017-12-02'),
      moment('2017-12-03'),
      moment('2017-12-04'),
      moment('2017-12-05'),
      moment('2017-12-06'),
      moment('2017-12-07'),
      moment('2017-12-08'),
      moment('2017-12-09').endOf('day'),
    ];
  }

  incrementWeek(week: Moment[]): Moment[] {
    const sunday = week[0].clone().startOf('week').add(7, 'day');
    return this.createWeek(sunday);
  }

  incrementWeekByDay(week: Moment[]): Moment[] {
    return this.createWeek(week[1].startOf('day'));
  }

  incrementTimeSpanByDay(timeSpan: Moment[]): Moment[] {
    return this.createTimeSpan(timeSpan[1].startOf('day'));
  }

  decrementWeekByDay(week: Moment[]): Moment[] {
    return this.createWeek(week[0].clone().subtract(1, 'day').startOf('day'));
  }

  decrementTimeSpanByDay(timeSpan: Moment[]): Moment[] {
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

  navigateToTimeSpan(date: Moment) {
    const sunday = date.clone().startOf('week');
    return this.createTimeSpan(sunday);
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

  createTimeSpan(startOfTimeSpan: Moment) {
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