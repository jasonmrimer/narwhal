import * as moment from 'moment';
import { Moment } from 'moment';
import PlannerService from '../PlannerService';

export default class PlannerServiceStub implements PlannerService {
  private _weeksInAdvance: number = 0;
  getCurrentWeek(): Moment[] {
    return [
      moment.utc('2017-11-26T05:00:00.000Z'),
      moment.utc('2017-11-27T05:00:00.000Z'),
      moment.utc('2017-11-28T05:00:00.000Z'),
      moment.utc('2017-11-29T05:00:00.000Z'),
      moment.utc('2017-11-30T05:00:00.000Z'),
      moment.utc('2017-12-01T05:00:00.000Z'),
      moment.utc('2017-12-02T05:00:00.000Z')
    ].map(day => day.add(7 * this._weeksInAdvance, 'day'));
  }

  incrementWeek() {
    this._weeksInAdvance += 1;
  }
}