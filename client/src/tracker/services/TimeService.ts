import { Moment } from 'moment';

export interface TimeService {
  getCurrentWeek(): Moment[];
  getCurrentTimeSpan(): Moment[];
  incrementWeek(week: Moment[]): Moment[];
  incrementWeekByDay(week: Moment[]): Moment[];
  incrementTimeSpanByDay(timeSpan: Moment[]): Moment[];
  decrementWeekByDay(week: Moment[]): Moment[];
  decrementTimeSpanByDay(timeSpan: Moment[]): Moment[];
  decrementWeek(week: Moment[]): Moment[];
  navigateToWeek(date: Moment): Moment[];
}
