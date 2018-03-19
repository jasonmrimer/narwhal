import * as React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import { Tracker } from './Tracker';
import { forIt, makeFakeTrackerStore } from '../utils/testUtils';
import { TrackerStore } from './stores/TrackerStore';
import { StyledLegend } from '../roster/Legend';
import { StyledRoster } from '../roster/Roster';
import { TopLevelFilter } from '../widgets/Filter';
import { StyledSidePanel } from './SidePanel';
import { AirmanModelFactory } from '../airman/factories/AirmanModelFactory';
import { StyledDeleteEventPopup } from '../event/DeleteEventPopup';
import { EventModelFactory } from '../event/factories/EventModelFactory';
import { TabType } from './stores/SidePanelStore';
import { ClipLoader } from 'react-spinners';

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

  it('should render the bar only while loading', async () => {
    expect(subject.find(ClipLoader).exists()).toBeFalsy();

    trackerStore.setLoading(true);
    subject.update();
    expect(subject.find(ClipLoader).exists()).toBeTruthy();
  });

  it('sets the trackerStores siteID and squadronId', () => {
    expect(trackerStore.siteId).toBe(1);
    expect(trackerStore.squadronId).toBe(-1);
  });

  it('should render a legend', () => {
    expect(subject.find(StyledLegend).exists()).toBeTruthy();
  });

  it('should render a roster', () => {
    expect(subject.find(StyledRoster).prop('trackerStore')).toBe(trackerStore);
  });

  describe('TopLevelFilter', () => {
    it('renders filters for site, squadron, and flight', () => {
      expect(subject.find(TopLevelFilter).length).toBe(3);
    });

    it('should render a site filter with the correct props', () => {
      const wrapper = findTopLevelFilterById(subject, '#site-filter');
      expect(wrapper.prop('value')).toEqual(trackerStore.siteId);
      expect(wrapper.prop('callback')).toEqual(trackerStore.setSiteId);
      expect(wrapper.prop('options')).toEqual(trackerStore.siteOptions);
    });

    it('should render a squadron filter with the correct props', () => {
      const wrapper = findTopLevelFilterById(subject, '#squadron-filter');
      expect(wrapper.prop('value')).toEqual(trackerStore.squadronId);
      expect(wrapper.prop('callback')).toEqual(trackerStore.setSquadronId);
      expect(wrapper.prop('options')).toEqual(trackerStore.squadronOptions);
    });

    it('should render a flight filter with the correct props', () => {
      const wrapper = findTopLevelFilterById(subject, '#flight-filter');
      expect(wrapper.prop('value')).toEqual(trackerStore.flightId);
      expect(wrapper.prop('callback')).toEqual(trackerStore.setFlightId);
      expect(wrapper.prop('options')).toEqual(trackerStore.flightOptions);
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

  describe('DeleteEventPopup', () => {
    it('should not render a delete event popup when there is no pending delete event', () => {
      expect(subject.find(StyledDeleteEventPopup).exists()).toBeFalsy();
    });

    it('should render a delete event popup when there is a pending delete event', () => {
      trackerStore.removeEvent(EventModelFactory.build());
      subject.update();
      expect(subject.find(StyledDeleteEventPopup).exists()).toBeTruthy();
    });
  });
});

const findTopLevelFilterById = (wrapper: ShallowWrapper, id: string) => {
  return wrapper.find(id);
};
