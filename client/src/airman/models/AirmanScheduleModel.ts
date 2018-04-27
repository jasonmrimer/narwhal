import { Moment } from 'moment';
import { ScheduleModel } from '../../schedule/models/ScheduleModel';

export class AirmanScheduleModel {
  constructor(public id: number,
              public airmanId: number,
              public schedule: ScheduleModel,
              public startDate: Moment,
              public endDate: Moment | null = null) {
  }

  isScheduledWorkDay = (day: Moment) => {
    switch (day.day()) {
      case (0) :
        return this.schedule.sunday;
      case (1) :
        return this.schedule.monday;
      case (2) :
        return this.schedule.tuesday;
      case (3) :
        return this.schedule.wednesday;
      case (4) :
        return this.schedule.thursday;
      case (5) :
        return this.schedule.friday;
      case (6) :
        return this.schedule.saturday;
      default :
        return true;
    }
  }
}