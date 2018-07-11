import * as React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import { SkillsField } from './SkillsField';

import { AirmanCertificationModelFactory } from '../airman/factories/AirmanCertificationModelFactory';
import { SkillsFieldStore } from './stores/SkillsFieldStore';
import * as moment from 'moment';

describe('SkillsField', () => {
  let subject: ShallowWrapper;
  let items = AirmanCertificationModelFactory.buildList(3, 1);
  let skillsFieldStore: SkillsFieldStore;
  beforeEach(() => {
    skillsFieldStore = new SkillsFieldStore();
    items[0].periodicDue = moment('2017-04-20 0000', 'YYYY-MM-DD HHmm');
    items[1].periodicDue = moment('2017-03-01 0000', 'YYYY-MM-DD HHmm');
    items[2].periodicDue = moment('2017-02-28 0000', 'YYYY-MM-DD HHmm');
    subject = shallow(
      <SkillsField
        items={items}
        skillsFieldStore={skillsFieldStore}
        currencyDate={moment('2017-03-01 0000', 'YYYY-MM-DD HHmm')}
      />
    );
  });

  it('should provide a list of skills', () => {
    const expectation = items[0].displayText + ' / ' + items[1].displayText + ' / ' + items[2].displayText;

    expect(subject.find('.skills-display').text()).toContain(expectation);
  });

  it('should show expiry styling when a skill is expired', () => {
     expect(subject.find('.expired').length).toBe(1);
  });

  it('should show expiry styling when a skill is close to expiration', () => {
    expect(subject.find('.closeExpiration').length).toBe(1);
  });
});