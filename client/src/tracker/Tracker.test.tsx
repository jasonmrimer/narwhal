import * as React from 'react';
import { mount, ReactWrapper } from 'enzyme';
import Roster from '../roster/Roster';
import { Tracker } from './Tracker';
import { makeFakeTrackerStore } from '../utils/testUtils';
import SidePanel from './SidePanel/SidePanel';
import TopBar from '../widgets/TopBar';
import TrackerStore from './stores/TrackerStore';
import Legend from '../roster/Legend';
import * as moment from 'moment';
import EventModel, { EventType } from '../event/EventModel';
import DeleteEventPopup from '../roster/DeleteEventPopup';

let trackerStore: TrackerStore;
let subject: ReactWrapper;

describe('Tracker', () => {
  beforeEach(async () => {
    trackerStore = await makeFakeTrackerStore();
    subject = mount(
      <Tracker
        username="Tytus"
        trackerStore={trackerStore}
      />
    );
  });

  it('renders legend above headers', () => {
    expect(subject.find(Legend).exists()).toBeTruthy();
  });

  it('renders a Roster with the current week', async () => {
    expect(subject.find(Roster).prop('trackerStore').plannerWeek).toEqual(trackerStore.plannerWeek);
  });

  it('renders the TopBar with a username and pageTitle', async () => {
    expect(subject.find(TopBar).prop('username')).toBe('Tytus');
    expect(subject.find(TopBar).prop('pageTitle')).toBe('AVAILABILITY ROSTER');
  });

  describe('the side panelStore', () => {
    it('does not render without a selected airman', () => {
      trackerStore.clearSelectedAirman();
      subject.update();
      expect(subject.find(SidePanel).exists()).toBeFalsy();
    });

    it('populates the side panelStore with the selected airman', () => {
      subject.find(Roster).find('tbody tr').at(0).simulate('click');

      const sidePanel = subject.find(SidePanel);
      expect(sidePanel.exists()).toBeTruthy();
      expect(sidePanel.text()).toContain(trackerStore.airmen[0].lastName);
      expect(sidePanel.text()).toContain(trackerStore.airmen[0].firstName);
    });

    it('closes the sidepanel', () => {
      subject.find(Roster).find('tbody tr').at(0).simulate('click');
      subject.find(SidePanel).find('button').at(0).simulate('click');
      expect(subject.find(SidePanel).exists()).toBeFalsy();
    });
  });

  it('renders a delete popup when there is a pending delete event', () => {
    const event = new EventModel('Title', 'Description', moment.utc(), moment.utc(), 1, EventType.Mission);
    expect(subject.find(DeleteEventPopup).exists()).toBeFalsy();
    trackerStore.setPendingDeleteEvent(event);
    subject.update();
    expect(subject.find(DeleteEventPopup).exists()).toBeTruthy();
  });
});
