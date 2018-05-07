import * as moment from 'moment';
import { TimeService } from './TimeService';

export function TimeServiceContract(subject: TimeService) {
  describe('getCurrentWeek', () => {
    it('returns a 7-day week array', async () => {
      const week = subject.getCurrentWeek();
      expect(week).toBeDefined();

      expect(week.length).toBe(7);
      week.forEach((day) => {
        expect(moment.isMoment(day)).toBeTruthy();
        expect(day).toBeTruthy();
      });
    });
  });

  describe('changing time', () => {
    it('should increment by a week', () => {
      let week = subject.getCurrentWeek();
      const startOfWeek = week[0].clone();
      week = subject.incrementWeek(week);
      expect(week[0].isSame(startOfWeek.add(7, 'days'))).toBeTruthy();
    });

    it('should increment by a day', () => {
      let week = subject.getCurrentWeek();
      const startOfWeek = week[0].clone();
      week = subject.incrementWeekByDay(week);
      expect(week[0].isSame(startOfWeek.add(1, 'days'))).toBeTruthy();
    });

    it('should decrement by a day', () => {
      let week = subject.getCurrentWeek();
      const startOfWeek = week[0].clone();
      week = subject.decrementWeekByDay(week);
      expect(week[0].isSame(startOfWeek.subtract(1, 'days'))).toBeTruthy();
    });

    it('should decrement by a week', () => {
      let week = subject.getCurrentWeek();
      const startOfWeek = week[0].clone();
      week = subject.decrementWeek(week);
      expect(week[0].isSame(startOfWeek.subtract(7, 'days'))).toBeTruthy();
    });

    it('should navigate to the week that contains a date', () => {
      const date = moment();
      const week = subject.navigateToWeek(date);
      const startOfWeek = date.clone().startOf('week');
      expect(week[0].isSame(startOfWeek)).toBeTruthy();
    });
  });
}
