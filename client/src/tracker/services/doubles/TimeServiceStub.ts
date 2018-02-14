import * as moment from 'moment';
import { Moment } from 'moment';
import { TimeService } from '../TimeService';

export class TimeServiceStub implements TimeService {
   getCurrentWeek(): Moment[] {
    return [
      moment.utc('2017-11-26T00:00:00.000Z'),
      moment.utc('2017-11-27T00:00:00.000Z'),
      moment.utc('2017-11-28T00:00:00.000Z'),
      moment.utc('2017-11-29T00:00:00.000Z'),
      moment.utc('2017-11-30T00:00:00.000Z'),
      moment.utc('2017-12-01T00:00:00.000Z'),
      moment.utc('2017-12-02T00:00:00.000Z')
    ];
  }

  incrementWeek(week: Moment[]): Moment[] {
    const sunday = week[0].utc().startOf('week').add(7, 'day');
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

  decrementWeek(week: Moment[]): Moment[] {
    const sunday = week[0].utc().startOf('week').subtract(7, 'day');
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