import * as React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import { SkillTile } from './SkillTile';
import { AirmanQualificationModelFactory } from '../airman/factories/AirmanQualificationModelFactory';
import * as moment from 'moment';
import { ExpirationAlert } from '../icons/ExpirationAlert';

describe('SkillTile', () => {
  let subject: ShallowWrapper;
  let skill = AirmanQualificationModelFactory.build(16);
  const handleClickSpy = jest.fn();

  beforeEach(() => {
    subject = shallow(
      <SkillTile
        skill={skill}
        handleClick={handleClickSpy}
      />
    );
  });

  it('should render the still title and expiration date', () => {
    expect(subject.text()).toContain(skill.title);
    expect(subject.text()).toContain(skill.expirationDate.format('DD MMM YY'));
  });

  it('calls the handleClick callback', () => {
    subject.simulate('click');
    expect(handleClickSpy).toBeCalledWith(skill);
  });

  it('renders an expiration alert when skill is expired', () => {
    skill.expirationDate = moment();
    subject.setProps({skill: skill});
    expect(subject.find(ExpirationAlert).exists()).toBeTruthy();
  });
});