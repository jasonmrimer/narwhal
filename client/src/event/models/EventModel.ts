import { Moment } from 'moment';

export enum EventType {
  Mission = 'MISSION',
  Appointment = 'APPOINTMENT',
  Leave = 'LEAVE',
  TDY_DEPLOYMENT = 'TDY_DEPLOYMENT'
}

export class EventModel {
  constructor(public title: string,
              public description: string,
              public startTime: Moment,
              public endTime: Moment,
              public airmanId: number,
              public type: EventType = EventType.Mission,
              public id: number | null = null) {
  }

  isOnDay(day: Moment) {
    return this.type === EventType.Mission
      ? day.clone().startOf('day').isSame(this.startTime.clone().startOf('day'))
      : day.isBetween(this.startTime, this.endTime, 'day', '[]');
  }
}