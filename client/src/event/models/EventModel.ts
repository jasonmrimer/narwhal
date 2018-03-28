import { Moment } from 'moment';

export enum EventType {
  Mission = 'MISSION',
  Appointment = 'APPOINTMENT',
  Leave = 'LEAVE',
  TDY_DEPLOYMENT = 'TDY/DEPLOYMENT'
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
}