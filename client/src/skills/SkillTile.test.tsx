import * as React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import { SkillTile } from './SkillTile';
import { AirmanQualificationModelFactory } from '../airman/factories/AirmanQualificationModelFactory';
import * as moment from 'moment';
import { SkillType } from './models/SkillType';
import { StyledExpirationSleeve } from '../widgets/ExpirationSleeve';
import { SkillsFieldStore } from './stores/SkillsFieldStore';

describe('SkillTile', () => {
  let subject: ShallowWrapper;
  let skill = AirmanQualificationModelFactory.build(16);
  let skillsFieldStore: SkillsFieldStore;
  const onClickSpy = jest.fn();

  beforeEach(() => {
    skillsFieldStore = new SkillsFieldStore();
    subject = shallow(
      <SkillTile
        skillsFieldStore={skillsFieldStore}
        skill={skill}
        onClick={onClickSpy}
      />
    );
  });

  it('should render the still title and expiration date', () => {
    const expirationDate = skillsFieldStore.timeToExpire(skill);

    expect(subject.text()).toContain(skill.title);
    expect(subject.text()).toContain(`${expirationDate}`);
  });

  it('calls the onConfirm callback', () => {
    subject.simulate('click');
    expect(onClickSpy).toBeCalledWith({
      id: skill.id,
      type: SkillType.Qualification,
      airmanId: skill.airmanId,
      skillId: skill.qualification.id,
      earnDate: skill.earnDate,
      periodicDue: skill.periodicDue,
      currencyExpiration: skill.currencyExpiration,
      lastSat: skill.lastSat,
    });
  });

  it('renders an expiration alert when skill periodicDue is expired', () => {
    skill.periodicDue = moment();
    subject.setProps({skill: skill});
    expect(subject.find(StyledExpirationSleeve).exists()).toBeTruthy();
  });

  it('renders an expiration alert when skill currencyExpiration is expired', () => {
    skill.currencyExpiration = moment();
    subject.setProps({skill: skill});
    subject.update();

    expect(subject.find(StyledExpirationSleeve).exists()).toBeTruthy();
  });
});