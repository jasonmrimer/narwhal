import { Moment } from 'moment';
import { ScheduleModel } from '../../schedule/models/ScheduleModel';

export class AirmanScheduleModel {
  constructor(public airmanId: number,
              public schedule: ScheduleModel,
              public startDate: Moment,
              public endDate: Moment | null = null,
              public id: number | null = null) {
  }
}