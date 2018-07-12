import { SkillsFieldStore } from './SkillsFieldStore';
import * as moment from 'moment';
import { Moment } from 'moment';

describe('SkillsFieldStore', () => {
  let subject: SkillsFieldStore;
  let expires: Moment;
  let afterExpiration: Moment;
  beforeEach(() => {
    subject = new SkillsFieldStore();
    expires = moment('2018-02-22 0000', 'YYYY-MM-DD HHmm');
    afterExpiration = moment('2018-02-23 0000', 'YYYY-MM-DD HHmm');
  });

  it('should be able to say whether a skill periodicDue is close to expiration', () => {
    const closeToExpiration = moment('2018-02-21 0000', 'YYYY-MM-DD HHmm');
    expect(subject.periodicDueIsCloseToExpiration(expires, closeToExpiration)).toBeTruthy();
    expect(subject.periodicDueIsCloseToExpiration(expires, afterExpiration)).toBeFalsy();
  });

  it('should be able to say whether a skill currencyExpiration is close to expiration', () => {
    const closeToExpiration = moment('2018-02-21 0000', 'YYYY-MM-DD HHmm');
    expect(subject.periodicDueIsCloseToExpiration(expires, closeToExpiration)).toBeTruthy();
    expect(subject.periodicDueIsCloseToExpiration(expires, afterExpiration)).toBeFalsy();
  });

  it('should be able to say a skill is expired', () => {
    expect(subject.isExpired(expires, afterExpiration)).toBeTruthy();
  });
});