import * as React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import { LocationFilters } from './LocationFilters';
import { LocationFilterStore } from './stores/LocationFilterStore';
import { StyledSingleTypeahead } from './inputs/SingleTypeahead';

describe('LocationFilters', () => {
  let subject: ShallowWrapper;
  let locationFilterStore: any;

  beforeEach(async () => {
    locationFilterStore = {
      siteOptions: [{value: 1, label: 'site1'}],
      selectedSiteId: -1,
      selectedSiteOption: [{value: 1, label: 'site1'}],
      setSelectedSite: jest.fn(),
      selectedSquadronId: -1,
      selectedSquadronOption: [{value: 1, label: 'squad1'}],
      setSelectedSquadron: jest.fn(),
      squadronOptions: [{value: 1, label: 'squad1'}],
      selectedFlightId: -1,
      setSelectedFlight: jest.fn(),
      selectedFlightOption: [{value: 1, label: 'flight1'}],
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
    expect(subject.find(StyledSingleTypeahead).length).toBe(3);
  });

  it('should render a site filter with the correct props', () => {
    const wrapper = subject.find('.site-filter');
    expect(wrapper.prop('selected')).toEqual(locationFilterStore.selectedSiteOption);
    expect(wrapper.prop('options')).toEqual(locationFilterStore.siteOptions);
  });

  it('should render a squadron filter with the correct props', () => {
    const wrapper = subject.find('.squadron-filter');
    expect(wrapper.prop('selected')).toEqual(locationFilterStore.selectedSquadronOption);
    expect(wrapper.prop('options')).toEqual(locationFilterStore.squadronOptions);
  });

  it('should render a flight filter with the correct props', () => {
    const wrapper = subject.find('.flight-filter');
    expect(wrapper.prop('selected')).toEqual(locationFilterStore.selectedFlightOption);
    expect(wrapper.prop('options')).toEqual(locationFilterStore.flightOptions);
  });
});