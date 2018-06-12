import * as React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import { SkillsField } from './SkillsField';

import { AirmanCertificationModelFactory } from '../airman/factories/AirmanCertificationModelFactory';
import { SkillsFieldStore } from './stores/SkillsFieldStore';

describe('SkillsField', () => {
  let subject: ShallowWrapper;
  let items = AirmanCertificationModelFactory.buildList(3, 1);
  beforeEach(() => {
    const skillsFieldStore = new SkillsFieldStore();
    subject = shallow(
        <SkillsField
          items={items}
          skillsFieldStore={skillsFieldStore}
        />
    );
  });

  it('should provide a list of skills', () => {
    const expectation = items[0].displayText + ' / ' + items[1].displayText + ' / ' + items[2].displayText;
    subject.update();
    expect(subject.find('.skills-display').text()).toContain(expectation);
  });
});