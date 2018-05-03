import * as React from 'react';
import { StyledDropdown } from './Dropdown';
import { TopLevelFilter } from './Filter';
import { shallow, ShallowWrapper } from 'enzyme';
import { LocationFilters } from './LocationFilters';
import { LocationFilterStore } from './stores/LocationFilterStore';

describe('LocationFilters', () => {
  let subject: ShallowWrapper;
  let locationFilterStore: any;

  beforeEach(async () => {
    locationFilterStore = {
      siteOptions: [{value: 1, label: 'site1'}],
      selectedSiteId: -1,
      setSelectedSite: jest.fn(),
      selectedSquadronId: -1,
      setSelectedSquadron: jest.fn(),
      squadronOptions: [{value: 1, label: 'squad1'}],
      selectedFlightId: -1,
      setSelectedFlight: jest.fn(),
      flightOptions: [{value: 1, label: 'flight1'}]
    };

    subject = shallow(
      <LocationFilters
        refreshAirmen={() => Promise.resolve()}
        locationFilterStore={locationFilterStore as LocationFilterStore}
      />
      );
  });

  it('renders filters for site, squadron, and flight', () => {
    expect(subject.find(StyledDropdown).length).toBe(1);
    expect(subject.find(TopLevelFilter).length).toBe(2);
  });

  it('should render a site filter with the correct props', () => {
    const wrapper = subject.find('#site-filter');
    expect(wrapper.prop('value')).toEqual(locationFilterStore.selectedSiteId);
    expect(wrapper.prop('options')).toEqual(locationFilterStore.siteOptions);
  });

  it('should render a squadron filter with the correct props', () => {
    const wrapper = subject.find('#squadron-filter');
    expect(wrapper.prop('value')).toEqual(locationFilterStore.selectedSquadronId);
    expect(wrapper.prop('callback')).toEqual(locationFilterStore.setSelectedSquadron);
    expect(wrapper.prop('options')).toEqual(locationFilterStore.squadronOptions);
  });

  it('should render a flight filter with the correct props', () => {
    const wrapper = subject.find('#flight-filter');
    expect(wrapper.prop('value')).toEqual(locationFilterStore.selectedFlightId);
    expect(wrapper.prop('callback')).toEqual(locationFilterStore.setSelectedFlight);
    expect(wrapper.prop('options')).toEqual(locationFilterStore.flightOptions);
  });
});