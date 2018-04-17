import * as React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import { SkillTile, timeToExpire } from './SkillTile';
import { AirmanQualificationModelFactory } from '../airman/factories/AirmanQualificationModelFactory';
import * as moment from 'moment';
import { SkillType } from './models/SkillType';
import { StyledExpirationSleeve } from '../widgets/ExpirationSleeve';

describe('SkillTile', () => {
  let subject: ShallowWrapper;
  let skill = AirmanQualificationModelFactory.build(16);
  const onClickSpy = jest.fn();

  beforeEach(() => {
    subject = shallow(
      <SkillTile
        skill={skill}
        onClick={onClickSpy}
      />
    );
  });

  it('should render the still title and expiration date', () => {
    const expirationDate = timeToExpire(skill.expirationDate);

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
      expirationDate: skill.expirationDate
    });
  });

  it('renders an expiration alert when skill is expired', () => {
    skill.expirationDate = moment();
    subject.setProps({skill: skill});
    expect(subject.find(StyledExpirationSleeve).exists()).toBeTruthy();
  });
});