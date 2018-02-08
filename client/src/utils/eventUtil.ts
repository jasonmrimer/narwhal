import EventModel from '../event/models/EventModel';
import { Moment } from 'moment';

export const doesDayHaveEvent = (day: Moment, event: EventModel) => {
  return day.isBetween(event.startTime, event.endTime, 'day', '[]');
};