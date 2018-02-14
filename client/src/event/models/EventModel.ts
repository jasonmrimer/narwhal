import * as moment from 'moment';
import { Moment } from 'moment';
import { EventForm, EventFormState } from '../EventForm';

export enum EventType {
  Mission = 'MISSION',
  Appointment = 'APPOINTMENT',
  Leave = 'LEAVE',
}

export class EventModel {
  static fromEventFormState(airmanId: number, state: EventFormState, id: number | null) {
    const {title, description, startDate, startTime, endDate, endTime, eventType} = state;
    const startDateTime = moment.utc(`${startDate} ${startTime}`, 'YYYY-MM-DD HH:mm');
    const endDateTime = moment.utc(`${endDate} ${endTime}`, 'YYYY-MM-DD HH:mm');
    return new EventModel(
      title,
      description,
      startDateTime,
      endDateTime,
      airmanId,
      eventType as EventType,
      id
    );
  }

  constructor(public title: string,
              public description: string,
              public startTime: Moment,
              public endTime: Moment,
              public airmanId: number,
              public type: EventType = EventType.Mission,
              public id: number | null = null) {
  }

  toEventFormState(): EventFormState {
    return {
      title: this.title,
      description: this.description,
      startDate: this.startTime.format(EventForm.MONTH_FORMAT),
      startTime: this.startTime.format(EventForm.TIME_FORMAT),
      endDate: this.endTime.format(EventForm.MONTH_FORMAT),
      endTime: this.endTime.format(EventForm.TIME_FORMAT),
      eventType: this.type,
    };
  }
}