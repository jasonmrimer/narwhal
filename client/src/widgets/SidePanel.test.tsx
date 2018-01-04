import * as React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import { SidePanel } from './SidePanel';
import AirmanModelFactory from '../airman/factories/AirmanModelFactory';
import AirmanModel from '../airman/models/AirmanModel';

const clickSpy = jest.fn();
let airman: AirmanModel;
let subject: ShallowWrapper;

describe('SidePanel', () => {
  beforeEach(() => {
    airman = AirmanModelFactory.build();
    subject = shallow(<SidePanel airman={airman} closeCallback={clickSpy}/>);
  });

  it('renders the currency for a selected airman', () => {
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

  it('calls the click callback', () => {
    subject.find('button').simulate('click');
    expect(clickSpy).toHaveBeenCalled();
  });
});