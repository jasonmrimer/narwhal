import { Moment } from 'moment';

export default interface PlannerService {
  getCurrentWeek(): Moment[];
}
