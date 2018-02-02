import * as React from 'react';
import { mount, ReactWrapper } from 'enzyme';
import { Currency } from './Currency';
import { findSelectorWithText, makeFakeTrackerStore } from '../../utils/testUtils';
import TrackerStore from '../stores/TrackerStore';
import AirmanModelFactory from '../../airman/factories/AirmanModelFactory';
import AirmanQualificationModel from '../../airman/models/AirmanQualificationModel';
import AirmanCertificationModel from '../../airman/models/AirmanCertificationModel';

describe('Currency', () => {
  const airman = AirmanModelFactory.build();

  let trackerStore: TrackerStore;
  let subject: ReactWrapper;

  beforeEach(async () => {
    trackerStore = await makeFakeTrackerStore();
    trackerStore.setSelectedAirman(airman);
    subject = mount(<Currency trackerStore={trackerStore}/>);
  });

  it('renders the currency of an airman', () => {
    airman.qualifications.forEach((qualification: AirmanQualificationModel) => {
      expect(subject.text()).toContain(qualification.acronym);
      expect(subject.text()).toContain(qualification.expirationDate.format('DD MMM YY'));
    });

    airman.certifications.forEach((certification: AirmanCertificationModel) => {
      expect(subject.text()).toContain(certification.title);
      expect(subject.text()).toContain(certification.expirationDate.format('DD MMM YY'));
    });
  });

  it('opens skill form on + Add Skill click', () => {
    findSelectorWithText(subject, 'button', '+ Add Skill').simulate('click');
    expect(subject.find('form').exists()).toBeTruthy();
  });
});