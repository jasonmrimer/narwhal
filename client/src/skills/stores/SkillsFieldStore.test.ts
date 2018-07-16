import { SkillsFieldStore } from './SkillsFieldStore';
import * as moment from 'moment';
import { Moment } from 'moment';
import { SkillType } from '../models/SkillType';

describe('SkillsFieldStore', () => {
  let subject: SkillsFieldStore;
  let expires: Moment;
  let afterExpiration: Moment;
  let skill: any;

  beforeEach(() => {
    subject = new SkillsFieldStore();
    expires = moment('2018-02-22 0000', 'YYYY-MM-DD HHmm');
    afterExpiration = moment('2018-02-23 0000', 'YYYY-MM-DD HHmm');

    skill = {
      id: 1,
      type: SkillType.Certification,
      airmanId: 1,
      skillId: 1,
      earnDate: moment(),
      periodicDue: moment().add(13, 'days'),
      currencyExpiration:  moment().subtract(4, 'days'),
      lastSat: moment()
    };
  });

  it('should be able to say whether a skill is close to expiration', () => {
    const closeToExpiration = moment('2018-02-21 0000', 'YYYY-MM-DD HHmm');
    expect(subject.isCloseToExpiration(expires, closeToExpiration)).toBeTruthy();
    expect(subject.isCloseToExpiration(expires, afterExpiration)).toBeFalsy();
  });

  it('should be able to say a skill is expired', () => {
    expect(subject.isExpired(expires, afterExpiration)).toBeTruthy();
  });

  it('should be able to say how long it has until it expires or how long it has been expired', () => {
    expect(subject.timeToExpire(skill)).toBe('Expired 4 days ago');
  });

  it('should return true if periodicDue or currencyExpiration is within 14 days or expired', () => {
    expect(subject.isFlaggedForExpiration(skill)).toBeTruthy();
  });
});