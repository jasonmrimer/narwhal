import { shallow, ShallowWrapper } from 'enzyme';
import { CertificationList } from './CertificationList';
import * as React from 'react';
import { CertificationModelFactory } from '../skills/factories/CertificationModelFactory';

describe('CertificationList', () => {
  let subject: ShallowWrapper;

  beforeEach(() => {
    const certifications = CertificationModelFactory.buildList(3, 1);
    subject = shallow(<CertificationList certifications={certifications}/>);
  });

  it('should render a header', () => {
    expect(subject.find('.certification-header').text()).toContain('CERTIFICATIONS');
  });

  it('should render a row for every certification', () => {
    expect(subject.find('.certification-row').length).toBe(3);
  });
});
