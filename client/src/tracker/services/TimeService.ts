import { Moment } from 'moment';

export default interface TimeService {
  getCurrentWeek(): Moment[];
  incrementWeek(week: Moment[]): Moment[];
  decrementWeek(week: Moment[]): Moment[];
}
