import * as moment from 'moment';
import { TimeService } from './TimeService';

export function TimeServiceContract(subject: TimeService) {
  describe('get current times', () => {
    it('should return a current week array of 7 days', () => {
      const week = subject.getCurrentWeek();
      expect(week).toBeDefined();

      expect(week.length).toBe(7);
      week.forEach((day) => {
        expect(moment.isMoment(day)).toBeTruthy();
        expect(day).toBeTruthy();
      });
    });

    it('should return a current time span of 14 days', () => {
      const timeSpan = subject.getCurrentTimeSpan();
      expect(timeSpan).toBeDefined();

      expect(timeSpan.length).toBe(14);
      timeSpan.forEach((day) => {
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

    it('should increment week by a day', () => {
      let timeSpan = subject.getCurrentTimeSpan();
      const startOfTimeSpan = timeSpan[0].clone();
      timeSpan = subject.incrementTimeSpanByDay(timeSpan);
      expect(timeSpan[0].isSame(startOfTimeSpan.add(1, 'days'))).toBeTruthy();
    });

    it('should increment time span by a day', () => {
      let week = subject.getCurrentWeek();
      const startOfWeek = week[0].clone();
      week = subject.incrementWeekByDay(week);
      expect(week[0].isSame(startOfWeek.add(1, 'days'))).toBeTruthy();
    });

    it('should decrement week by a day', () => {
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

    it('should navigate to a time span that starts on a date', () => {
      const date = moment();
      const timeSpan = subject.navigateToTimeSpan(date);
      const startOfTimeSpan = date.clone().startOf('week');
      expect(timeSpan[0].isSame(startOfTimeSpan)).toBeTruthy();
      expect(timeSpan[13].isSame(startOfTimeSpan.add(13, 'days').endOf('day'))).toBeTruthy();
    });
  });
}
