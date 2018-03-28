import * as React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import { Tracker } from './Tracker';
import { forIt, makeFakeTrackerStore } from '../utils/testUtils';
import { TrackerStore } from './stores/TrackerStore';
import { StyledLegend } from '../roster/Legend';
import { TopLevelFilter } from '../widgets/Filter';
import { StyledSidePanel } from './SidePanel';
import { AirmanModelFactory } from '../airman/factories/AirmanModelFactory';
import { TabType } from './stores/SidePanelStore';
import { StyledRosterContainer } from '../roster/RosterContainer';
import { UnfilteredValue } from '../widgets/models/FilterOptionModel';
import { StyledLoadingOverlay } from '../widgets/LoadingOverlay';

let trackerStore: TrackerStore;
let subject: ShallowWrapper;

describe('Tracker', () => {
  beforeEach(async () => {
    trackerStore = await makeFakeTrackerStore(false);
    subject = shallow(
      <Tracker
        trackerStore={trackerStore}
        profile={{id: 1, username: 'Tytus', siteId: 1}}
      />
    );
    await forIt();
    subject.update();
  });

  it('should render the spinner only while loading', async () => {
    expect(subject.find(StyledLoadingOverlay).exists()).toBeFalsy();

    trackerStore.setLoading(true);
    subject.update();
    expect(subject.find(StyledLoadingOverlay).exists()).toBeTruthy();
  });

  it('sets the trackerStores siteID and selectedSquadron', () => {
    expect(trackerStore.trackerFilterStore.selectedSite).toBe(1);
    expect(trackerStore.trackerFilterStore.selectedSquadron).toBe(UnfilteredValue);
  });

  it('should render a legend', () => {
    expect(subject.find(StyledLegend).exists()).toBeTruthy();
  });

  it('should render a roster', () => {
    expect(subject.find(StyledRosterContainer).prop('trackerStore')).toBe(trackerStore);
  });

  describe('TopLevelFilter', () => {
    it('renders filters for site, squadron, and flight', () => {
      expect(subject.find(TopLevelFilter).length).toBe(3);
    });

    it('should render a site filter with the correct props', () => {
      const wrapper = findTopLevelFilterById(subject, '#site-filter');
      expect(wrapper.prop('value')).toEqual(trackerStore.trackerFilterStore.selectedSite);
      expect(wrapper.prop('callback')).toEqual(trackerStore.trackerFilterStore.setSelectedSite);
      expect(wrapper.prop('options')).toEqual(trackerStore.trackerFilterStore.siteOptions);
    });

    it('should render a squadron filter with the correct props', () => {
      const wrapper = findTopLevelFilterById(subject, '#squadron-filter');
      expect(wrapper.prop('value')).toEqual(trackerStore.trackerFilterStore.selectedSquadron);
      expect(wrapper.prop('callback')).toEqual(trackerStore.trackerFilterStore.setSelectedSquadron);
      expect(wrapper.prop('options')).toEqual(trackerStore.trackerFilterStore.squadronOptions);
    });

    it('should render a flight filter with the correct props', () => {
      const wrapper = findTopLevelFilterById(subject, '#flight-filter');
      expect(wrapper.prop('value')).toEqual(trackerStore.trackerFilterStore.selectedFlight);
      expect(wrapper.prop('callback')).toEqual(trackerStore.trackerFilterStore.setSelectedFlight);
      expect(wrapper.prop('options')).toEqual(trackerStore.trackerFilterStore.flightOptions);
    });
  });

  describe('SidePanel', () => {
    it('should not render a sidepanel when no airman is selected', () => {
      trackerStore.clearSelectedAirman();
      expect(subject.find(StyledSidePanel).exists()).toBeFalsy();
    });

    it('should render a sidepanel when an airman is selected', () => {
      trackerStore.setSelectedAirman(AirmanModelFactory.build(), TabType.AVAILABILITY);
      subject.update();
      expect(subject.find(StyledSidePanel).exists()).toBeTruthy();
    });
  });
});

const findTopLevelFilterById = (wrapper: ShallowWrapper, id: string) => {
  return wrapper.find(id);
};
