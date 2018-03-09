import { EventModel, EventType } from '../event/models/EventModel';
import { Moment } from 'moment';

export const doesDayHaveEvent = (day: Moment, event: EventModel) => {
  return day.isBetween(event.startTime, event.endTime, 'day', '[]');
};

export const doesMissionStartOnDay = (day: Moment, event: EventModel) => {
  return day.isSame(event.startTime.format('YYYY-MM-DD'));
};

export const findEventsForDay = (events: EventModel[], day: Moment) => {
  return events.filter(
    event => {
      return event.type === EventType.Mission
        ? doesMissionStartOnDay(day, event)
        : doesDayHaveEvent(day, event);
    });
};