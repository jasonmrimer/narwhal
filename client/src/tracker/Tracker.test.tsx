import * as React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import { Tracker } from './Tracker';
import { forIt, makeFakeTrackerStore } from '../utils/testUtils';
import { TrackerStore } from './stores/TrackerStore';
import { StyledLegend } from '../roster/Legend';
import { StyledSidePanel } from './SidePanel';
import { AirmanModelFactory } from '../airman/factories/AirmanModelFactory';
import { TabType } from './stores/SidePanelStore';
import { StyledRosterContainer } from '../roster/RosterContainer';
import { UnfilteredValue } from '../widgets/models/FilterOptionModel';
import { StyledLoadingOverlay } from '../widgets/LoadingOverlay';
import { EventModel, EventType } from '../event/models/EventModel';
import * as moment from 'moment';
import { StyledLocationFilters } from '../widgets/LocationFilters';
import { StyledDeletePopup } from '../widgets/DeletePopup';
import { AirmanCertificationModelFactory } from '../airman/factories/AirmanCertificationModelFactory';

let trackerStore: TrackerStore;
let subject: ShallowWrapper;

describe('Tracker', () => {
  beforeEach(async () => {
    trackerStore = await makeFakeTrackerStore(false);
    subject = shallow(
      <Tracker
        trackerStore={trackerStore}
        profile={{id: 1, username: 'Tytus', siteId: 1, siteName: '1', role: 'ADMIN', classified: false}}
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
    expect(trackerStore.locationFilterStore.selectedSite).toBe(1);
    expect(trackerStore.locationFilterStore.selectedSquadron).toBe(UnfilteredValue);
  });

  it('should render location filters', () => {
    expect(subject.find(StyledLocationFilters).exists()).toBeTruthy();
  });

  it('should render a legend', () => {
    expect(subject.find(StyledLegend).exists()).toBeTruthy();
  });

  it('should render a roster', () => {
    expect(subject.find(StyledRosterContainer).prop('trackerStore')).toBe(trackerStore);
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

  it('renders a delete popup when there is a pending delete event', () => {
    const event = new EventModel('Title', 'Description', moment(), moment(), 1, EventType.Appointment);

    trackerStore.availabilityStore.showEventForm();
    expect(subject.find(StyledDeletePopup).exists()).toBeFalsy();

    trackerStore.availabilityStore.removeEvent(event);
    subject.update();
    expect(subject.find(StyledDeletePopup).exists()).toBeTruthy();
  });

  it('render a delete popup when there is a pending delete skill', async () => {
    expect(subject.find(StyledDeletePopup).exists()).toBeFalsy();
    trackerStore.currencyStore.setPendingDeleteSkill(AirmanCertificationModelFactory.build(1, 1));
    subject.update();
    expect(subject.find(StyledDeletePopup).prop('onConfirm')).toBe(trackerStore.currencyStore.removeSkill);
    expect(subject.find(StyledDeletePopup).prop('onCancel')).toBe(trackerStore.currencyStore.setPendingDeleteSkill);
    expect(subject.find(StyledDeletePopup).exists()).toBeTruthy();

    await trackerStore.currencyStore.removeSkill();
    subject.update();
    expect(subject.find(StyledDeletePopup).exists()).toBeFalsy();
  });
});
