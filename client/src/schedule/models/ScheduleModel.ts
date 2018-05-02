import * as moment from 'moment';
import { Moment } from 'moment';

export enum ScheduleType {
  NoSchedule = 'No Schedule',
  FrontHalf = 'Front Half',
  BackHalf = 'Back Half',
  MondayToFriday = 'Monday - Friday',
  PanamaA = 'Panama A',
  PanamaB = 'Panama B'
}

export class ScheduleModel {
  constructor(public id: number,
              public type: ScheduleType,
              public sunday: boolean = true,
              public monday: boolean = true,
              public tuesday: boolean = true,
              public wednesday: boolean = true,
              public thursday: boolean = true,
              public friday: boolean = true,
              public saturday: boolean = true) {
  }

  /**
   *   We picked an arbitrary start date of the UNIX epoch
   *   on which to calculate the alternating Panama schedules
   *   to compensate for leap weeks (those are a thing)
   */
  isScheduledWorkDay = (day: Moment) => {
    if (this.type !== ScheduleType.PanamaA && this.type !== ScheduleType.PanamaB) {
      return this.getScheduleDay(day);
    } else {
      if (day.diff(moment(0).day('Sunday').startOf('day'), 'weeks') % 2 === 0) {
        return this.getScheduleDay(day);
      } else {
        return !this.getScheduleDay(day);
      }
    }
  }

  private getScheduleDay(date: Moment) {
    switch (date.day()) {
      case (0) :
        return this.sunday;
      case (1) :
        return this.monday;
      case (2) :
        return this.tuesday;
      case (3) :
        return this.wednesday;
      case (4) :
        return this.thursday;
      case (5) :
        return this.friday;
      case (6) :
        return this.saturday;
      default :
        return true;
    }
  }
}