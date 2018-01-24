import TimeService from './TimeService';
import * as moment from 'moment';
import { Moment } from 'moment';

export class MomentTimeService implements TimeService {
  getCurrentWeek(): Moment[] {
    const sunday = moment.utc().startOf('week');
    return [
      sunday,
      sunday.clone().add(1, 'day'),
      sunday.clone().add(2, 'day'),
      sunday.clone().add(3, 'day'),
      sunday.clone().add(4, 'day'),
      sunday.clone().add(5, 'day'),
      sunday.clone().add(6, 'day')
    ];
  }

  incrementWeek(week: Moment[]): Moment[] {
    const sunday = week[0].clone().utc().startOf('week').add(7, 'day');
    return [
      sunday,
      sunday.clone().add(1, 'day'),
      sunday.clone().add(2, 'day'),
      sunday.clone().add(3, 'day'),
      sunday.clone().add(4, 'day'),
      sunday.clone().add(5, 'day'),
      sunday.clone().add(6, 'day')
    ];
  }
}