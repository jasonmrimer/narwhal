import { Moment } from 'moment';

export interface TimeService {
  getCurrentWeek(): Moment[];
  incrementWeek(week: Moment[]): Moment[];
  decrementWeek(week: Moment[]): Moment[];
}
