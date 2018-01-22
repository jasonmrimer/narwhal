import * as React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import { SidePanel } from './SidePanel';
import AirmanModelFactory from '../../airman/factories/AirmanModelFactory';
import AirmanModel from '../../airman/models/AirmanModel';
import Currency from './Currency';
import Availability from './Availability';
import Tab from './Tab';
import TrackerStore from '../stores/TrackerStore';
import { makeFakeTrackerStore } from '../../utils/testUtils';

let airman: AirmanModel;
let trackerStore: TrackerStore;
let subject: ShallowWrapper;

describe('SidePanel', () => {
  beforeEach(async () => {
    airman = AirmanModelFactory.build();

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
    expect(subject.find(Tab).length).toBe(2);
    expect(subject.find(Tab).at(0).prop('title')).toBe('CURRENCY');
    expect(subject.find(Tab).at(1).prop('title')).toBe('AVAILABILITY');
  });

  it('renders the availability for a selected airman', () => {
    const availability = subject.find(Availability);
    expect(availability.exists()).toBeTruthy();
  });

  it('renders the currency for a selected airman', () => {
    subject.find(Tab).at(0).simulate('click');
    const currency = subject.find(Currency);
    expect(currency.exists()).toBeTruthy();
  });

  it('makes the tab active when selected', () => {
    subject.find(Tab).at(0).simulate('click');
    expect(subject.find(Tab).at(0).prop('isActive')).toBeTruthy();
    expect(subject.find(Tab).at(1).prop('isActive')).toBeFalsy();

    subject.find(Tab).at(1).simulate('click');
    expect(subject.find(Tab).at(0).prop('isActive')).toBeFalsy();
    expect(subject.find(Tab).at(1).prop('isActive')).toBeTruthy();
  });

  it('calls the callback', () => {
    subject.find('button').simulate('click');
    expect(trackerStore.selectedAirman.id).toBe(-1);
  });
});