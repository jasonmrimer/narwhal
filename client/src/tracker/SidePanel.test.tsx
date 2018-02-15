import * as React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import { SidePanel } from './SidePanel';
import { AirmanModelFactory } from '../airman/factories/AirmanModelFactory';
import { AirmanModel } from '../airman/models/AirmanModel';
import { StyledCurrency } from '../currency/Currency';
import { TrackerStore } from './stores/TrackerStore';
import { makeFakeTrackerStore } from '../utils/testUtils';
import { AirmanCertificationModel } from '../airman/models/AirmanCertificationModel';
import { CertificationModelFactory } from '../skills/factories/CertificationModelFactory';
import * as moment from 'moment';
import { TabAlert } from '../icons/TabAlert';
import { StyledTab } from './Tab';
import { StyledAvailability } from '../availability/Availability';

let airman: AirmanModel;
let trackerStore: TrackerStore;
let subject: ShallowWrapper;

describe('SidePanel', () => {
  beforeEach(async () => {
    airman = AirmanModelFactory.build();
    const certification = new AirmanCertificationModel(
      airman.id,
      CertificationModelFactory.build(1),
      moment(),
      moment().subtract(3, 'year')
    );
    airman.certifications.push(certification);

    trackerStore = await makeFakeTrackerStore();
    trackerStore.setSelectedAirman(airman);

    subject = shallow(
      <SidePanel
        trackerStore={trackerStore}
      />
    );
  });

  it('shows the airmans name', () => {
    expect(subject.text()).toContain(`${airman.lastName}, ${airman.firstName}`);
  });

  it('shows two tabs', () => {
    expect(subject.find(StyledTab).length).toBe(2);
    expect(subject.find(StyledTab).at(0).prop('title')).toBe('CURRENCY');
    expect(subject.find(StyledTab).at(1).prop('title')).toBe('AVAILABILITY');
  });

  it('renders the availability for a selected airman', () => {
    const availability = subject.find(StyledAvailability);
    expect(availability.exists()).toBeTruthy();
  });

  it('renders the currency for a selected airman', () => {
    subject.find(StyledTab).at(0).simulate('click');
    const currency = subject.find(StyledCurrency);
    expect(currency.exists()).toBeTruthy();
  });

  it('makes the tab active when selected', () => {
    subject.find(StyledTab).at(0).simulate('click');
    expect(subject.find(StyledTab).at(0).prop('isActive')).toBeTruthy();
    expect(subject.find(StyledTab).at(1).prop('isActive')).toBeFalsy();

    subject.find(StyledTab).at(1).simulate('click');
    expect(subject.find(StyledTab).at(0).prop('isActive')).toBeFalsy();
    expect(subject.find(StyledTab).at(1).prop('isActive')).toBeTruthy();
  });

  it('shows a tab alert when the airman has an expired skill', () => {
    expect(subject.find(TabAlert).exists()).toBeTruthy();
  });

  it('calls the callback', () => {
    subject.find('button').simulate('click');
    expect(trackerStore.selectedAirman.id).toBe(-1);
  });
});