import { Moment } from 'moment';

export enum EventType {
  Appointment = 'APPOINTMENT',
  Leave = 'LEAVE',
  Mission = 'MISSION',
}

export default class EventModel {
  constructor(public title: string,
              public description: string,
              public startTime: Moment,
              public endTime: Moment,
              public airmanId: number,
              public type: EventType = EventType.Mission,
              public id: number | null = null) {
  }
}