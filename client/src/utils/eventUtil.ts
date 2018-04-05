import { EventModel, EventType } from '../event/models/EventModel';
import { Moment } from 'moment';
import { CertificationModel } from '../skills/models/CertificationModel';

export const doesDayHaveEvent = (day: Moment, event: EventModel) => {
  return day.isBetween(event.startTime, event.endTime, 'day', '[]');
};

export const doesMissionStartOnDay = (day: Moment, event: EventModel) => {
  return day.clone().startOf('day').isSame(event.startTime.clone().startOf('day'));
};

export const findEventsForDay = (events: EventModel[], day: Moment) => {
  return events.filter(
    event => {
      return event.type === EventType.Mission
        ? doesMissionStartOnDay(day, event)
        : doesDayHaveEvent(day, event);
    });
};

export const filterOptionsBy = (certifications: CertificationModel[], comparer: number) => {
  return certifications.filter((cert: CertificationModel) => {
    return (cert.siteId === comparer);
  }).map(cert => {
    return {value: cert.id, label: cert.title};
  });
};
