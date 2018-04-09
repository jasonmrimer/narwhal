import * as React from 'react';
import { StyledDropdown } from './Dropdown';
import { TopLevelFilter } from './Filter';
import { shallow, ShallowWrapper } from 'enzyme';
import { LocationFilters } from './LocationFilters';
import { makeFakeTrackerStore } from '../utils/testUtils';
import { TrackerStore } from '../tracker/stores/TrackerStore';

describe('LocationFilters', () => {
  let subject: ShallowWrapper;
  let trackerStore: TrackerStore;
  beforeEach(async () => {
    trackerStore = await makeFakeTrackerStore(false);
    subject = shallow(
      <LocationFilters locationFilterStore={trackerStore.locationFilterStore}/>
      );
  });

  it('renders filters for site, squadron, and flight', () => {
    expect(subject.find(StyledDropdown).length).toBe(1);
    expect(subject.find(TopLevelFilter).length).toBe(2);
  });

  it('should render a site filter with the correct props', () => {
    const wrapper = subject.find('#site-filter');
    expect(wrapper.prop('value')).toEqual(trackerStore.locationFilterStore.selectedSite);
    expect(wrapper.prop('options')).toEqual(trackerStore.locationFilterStore.siteOptions);
  });

  it('should render a squadron filter with the correct props', () => {
    const wrapper = subject.find('#squadron-filter');
    expect(wrapper.prop('value')).toEqual(trackerStore.locationFilterStore.selectedSquadron);
    expect(wrapper.prop('callback')).toEqual(trackerStore.locationFilterStore.setSelectedSquadron);
    expect(wrapper.prop('options')).toEqual(trackerStore.locationFilterStore.squadronOptions);
  });

  it('should render a flight filter with the correct props', () => {
    const wrapper = subject.find('#flight-filter');
    expect(wrapper.prop('value')).toEqual(trackerStore.locationFilterStore.selectedFlight);
    expect(wrapper.prop('callback')).toEqual(trackerStore.locationFilterStore.setSelectedFlight);
    expect(wrapper.prop('options')).toEqual(trackerStore.locationFilterStore.flightOptions);
  });
});