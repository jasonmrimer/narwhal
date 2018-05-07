import * as React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import { Tracker } from './Tracker';
import { forIt } from '../utils/testUtils';
import { TrackerStore } from './stores/TrackerStore';
import { StyledLegend } from '../roster/Legend';
import { StyledSidePanel } from './SidePanel';
import { AirmanModelFactory } from '../airman/factories/AirmanModelFactory';
import { StyledRosterContainer } from '../roster/RosterContainer';
import { StyledLoadingOverlay } from '../widgets/LoadingOverlay';
import { EventModel, EventType } from '../event/models/EventModel';
import * as moment from 'moment';
import { StyledLocationFilters } from '../widgets/LocationFilters';
import { StyledDeletePopup } from '../widgets/DeletePopup';
import { DoubleRepositories } from '../utils/Repositories';
import { AvailabilityStore } from '../availability/stores/AvailabilityStore';
import { CurrencyStore } from '../currency/stores/CurrencyStore';
import { EventModelFactory } from '../event/factories/EventModelFactory';

let trackerStore: TrackerStore;
let availabilityStore: AvailabilityStore;
let currencyStore: CurrencyStore;
let subject: ShallowWrapper;
let eventActions: any;

describe('Tracker', () => {
  beforeEach(async () => {
    trackerStore = new TrackerStore(DoubleRepositories);
    availabilityStore = new AvailabilityStore(DoubleRepositories);
    currencyStore = new CurrencyStore(DoubleRepositories);
    eventActions = {
      executePendingDelete: jest.fn(),
    }

    subject = shallow(
      <Tracker
        trackerStore={trackerStore}
        availabilityStore={availabilityStore}
        currencyStore={currencyStore}
        eventActions={eventActions}
        profile={
          {
            id: 1,
            username: 'Tytus',
            siteId: 1,
            siteName: '1',
            roleName: 'ADMIN',
            roleId: 1,
            classified: false
          }
        }
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

  it('should render location filters', () => {
    expect(subject.find(StyledLocationFilters).exists()).toBeTruthy();
  });

  it('should render a legend', () => {
    expect(subject.find(StyledLegend).exists()).toBeTruthy();
  });

  it('should render a roster', () => {
    expect(subject.find(StyledRosterContainer).exists()).toBeTruthy();
  });

  describe('SidePanel', () => {
    it('should not render a sidepanel when no airman is selected', () => {
      trackerStore.clearSelectedAirman();
      expect(subject.find(StyledSidePanel).exists()).toBeFalsy();
    });

    it('should render a sidepanel when an airman is selected', () => {
      trackerStore.setSelectedAirman(AirmanModelFactory.build());
      subject.update();
      expect(subject.find(StyledSidePanel).exists()).toBeTruthy();
    });
  });

  it('renders a delete popup when there is a pending delete event', () => {
    const event = new EventModel('Title', 'Description', moment(), moment(), 1, EventType.Appointment);

    availabilityStore.showEventForm();
    expect(subject.find(StyledDeletePopup).exists()).toBeFalsy();

    availabilityStore.removeEvent(event);
    subject.update();
    expect(subject.find(StyledDeletePopup).exists()).toBeTruthy();
  });

  it('render a delete popup when there is a pending delete skill', async () => {
    expect(subject.find(StyledDeletePopup).exists()).toBeFalsy();
    availabilityStore.removeEvent(EventModelFactory.build());
    subject.update();
    expect(subject.find(StyledDeletePopup).exists()).toBeTruthy();

    await availabilityStore.executePendingDelete();
    subject.update();
    expect(subject.find(StyledDeletePopup).exists()).toBeFalsy();
  });
});
