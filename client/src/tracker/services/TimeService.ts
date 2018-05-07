import { Moment } from 'moment';

export interface TimeService {
  getCurrentWeek(): Moment[];
  incrementWeek(week: Moment[]): Moment[];
  incrementWeekByDay(week: Moment[]): Moment[];
  decrementWeekByDay(week: Moment[]): Moment[];
  decrementWeek(week: Moment[]): Moment[];
  navigateToWeek(date: Moment): Moment[];
}
