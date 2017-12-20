import * as moment from 'moment';
import PlannerService from './PlannerService';

export default function plannerServiceContract(subject: PlannerService) {
  describe('getCurrentWeek', () => {
    it('returns a 7-day week array', async () => {
      const week = subject.getCurrentWeek();
      expect(week).toBeDefined();

      expect(week.length).toBe(7);
      week.forEach((day) => {
        expect(moment.isMoment(day)).toBeTruthy();
      });
    });
  });
}
