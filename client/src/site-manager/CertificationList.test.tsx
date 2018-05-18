import { shallow, ShallowWrapper } from 'enzyme';
import { CertificationList } from './CertificationList';
import * as React from 'react';
import { CertificationModelFactory } from '../skills/certification/factories/CertificationModelFactory';
import { Link } from 'react-router-dom';
import { CertificationModel } from '../skills/certification/models/CertificationModel';

describe('CertificationList', () => {
  let subject: ShallowWrapper;
  let certifications: CertificationModel[];

  beforeEach(() => {
    certifications = CertificationModelFactory.buildList(3, 1);
    subject = shallow(<CertificationList certifications={certifications}/>);
  });

  it('should render a header', () => {
    expect(subject.find('.certification-header').text()).toContain('CERTIFICATIONS');
  });

  it('should render a new certification button', () => {
    const link = subject.find(Link).at(0);
    expect(link.prop('to')).toBe('/certifications/new');
    expect(link.childAt(1).text()).toContain('ADD CERTIFICATION');

  });

  it('should render a row for every certification', () => {
    expect(subject.find('.certification-row').length).toBe(3);
  });

  it('should render a link to the airmans profile', () => {
    const link = subject.find(Link).at(1);
    expect(link.prop('to')).toBe(`/certifications/${certifications[0].id}`);
    expect(link.children().at(0).text()).toContain(certifications[0].title);
  });
});
