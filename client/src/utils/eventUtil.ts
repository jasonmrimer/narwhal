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
      if (event.type === EventType.Mission) {
        return doesMissionStartOnDay(day, event);
      } else {
        return doesDayHaveEvent(day, event);
      }
    }
  );
};