import * as React from 'react';
import { shallow } from 'enzyme';
import { SideBar } from './SideBar';
import AirmanModelFactory from '../airman/factories/AirmanModelFactory';

describe('Sidebar', () => {
  it('renders the currency for a selected airman', () => {
    const airman = AirmanModelFactory.build();
    const subject = shallow(<SideBar airman={airman}/>);

    expect(subject.text()).toContain(`${airman.lastName}, ${airman.firstName}`);
    airman.qualifications.forEach((qualification) => {
      expect(subject.text()).toContain(qualification.acronym);
      expect(subject.text()).toContain(qualification.expirationDate.format('DD MMM YY'));
    });

    airman.certifications.forEach((certification) => {
      expect(subject.text()).toContain(certification.title);
      expect(subject.text()).toContain(certification.expirationDate.format('DD MMM YY'));
    });
  });
});