import * as React from 'react';
import { shallow } from 'enzyme';
import AirmanModelFactory from '../airman/factories/AirmanModelFactory';
import { Currency } from './Currency';

describe('Currency', () => {
  const airman = AirmanModelFactory.build();
  const subject = shallow(<Currency airman={airman}/>);

  it('renders the currency of an airman', () => {
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