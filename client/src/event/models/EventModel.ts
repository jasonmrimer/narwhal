import { Moment } from 'moment';

export enum EventType {
  Mission = 'MISSION',
  Appointment = 'APPOINTMENT',
  Leave = 'LEAVE',
  TDY_DEPLOYMENT = 'TDY_DEPLOYMENT'
}

export enum EventStatus {
  Pending = 'PENDING',
  Approved = 'APPROVED',
  AutoAuthorized = 'AUTO_AUTHORIZED'
}

export enum EventApproval {
  Denied = 'DENIED',
  Approved = 'APPROVED',
}

export enum EventApprovalRole {
  Scheduler = 'SCHEDULER',
  Supervisor = 'SUPERVISOR',
}

export class EventModel {
  constructor(
    public title: string,
    public description: string,
    public startTime: Moment,
    public endTime: Moment,
    public airmanId: number,
    public type: EventType = EventType.Mission,
    public id: number | null = null,
    public status: EventStatus | null = null,
    public createdBy: string | null = null,
    public createdOn: Moment | null = null,
    public supervisorUsername: string | null = null,
    public supervisorApproval: EventApproval | null = null,
    public supervisorApprovalTime: Moment | null = null,
    public schedulerUsername: string | null = null,
    public schedulerApproval: EventApproval | null = null,
    public schedulerApprovalTime: Moment | null = null
  ) {
  }

  isOnDay(day: Moment) {
    return this.type === EventType.Mission
      ? day.clone().startOf('day').isSame(this.startTime.clone().startOf('day'))
      : day.isBetween(this.startTime, this.endTime, 'day', '[]');
  }
}