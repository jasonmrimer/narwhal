import * as moment from 'moment';
import { Moment } from 'moment';
import PlannerService from '../PlannerService';

export default class PlannerServiceStub implements PlannerService {
  getCurrentWeek(): Moment[] {
    return [
      moment('2017-11-26T05:00:00.000Z'),
      moment('2017-11-27T05:00:00.000Z'),
      moment('2017-11-28T05:00:00.000Z'),
      moment('2017-11-29T05:00:00.000Z'),
      moment('2017-11-30T05:00:00.000Z'),
      moment('2017-12-01T05:00:00.000Z'),
      moment('2017-12-02T05:00:00.000Z')
    ];
  }
}