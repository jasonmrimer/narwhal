import { MissionModelFactory } from '../factories/MissionModelFactory';
import * as moment from 'moment';
import { MissionModel } from './MissionModel';

describe('MissionModel', () => {
  let subject: MissionModel;

  beforeEach(() => {
    subject = MissionModelFactory.build();
  });

  it('should display a string of a date with UTC timezone', () => {
    subject.startDateTime = moment('May 14 1988 0000', 'MMM DD YYYY HHmm Z');
    expect(subject.displayDateZulu).toBe('14 MAY 88');
  });

  it('should display a string of a date with local timezone', () => {
    const localTimeZone = '-04:00';
    subject.startDateTime = moment('May 14 1988 2000', 'MMM DD YYYY HHmm ' + localTimeZone);
    expect(subject.displayDateLocal).toBe('14 MAY 88');
  });

  it('should display updated at in reference frame', () => {
    subject.updatedAt = moment().subtract(5, 'minute');
    expect(subject.displayUpdatedAt).toBe('5 minutes ago');
  });
});