import * as React from 'react';
import { mount, ReactWrapper } from 'enzyme';
import { Tracker } from './Tracker';
import {
  clickButtonByName, clickOnFirstAirman, forIt,
  makeFakeTrackerStore
} from '../utils/testUtils';
import { SidePanel } from './SidePanel';
import { TrackerStore } from './stores/TrackerStore';
import * as moment from 'moment';
import { StyledDeleteEventPopup } from '../event/DeleteEventPopup';
import { EventModel, EventType } from '../event/models/EventModel';
import { AirmanModel } from '../airman/models/AirmanModel';
import { Roster } from '../roster/Roster';
import { MemoryRouter } from 'react-router';

let trackerStore: TrackerStore;
let subject: ReactWrapper;
let airman: AirmanModel;

describe('Tracker', () => {
  beforeEach(async () => {
    trackerStore = await makeFakeTrackerStore();
    subject = mount(
      <MemoryRouter>
        <Tracker
          profile={{username: 'Tytus', siteId: 1}}
          trackerStore={trackerStore}
        />
      </MemoryRouter>
    );
    forIt();
    airman = trackerStore.airmen[0];
  });

  describe('Roster', () => {
    describe('navigates dates', () => {
      const currentWeek = '26SUN27MON28TUE29WED30THU01FRI02SAT';
      const lastWeek = '19SUN20MON21TUE22WED23THU24FRI25SAT';
      const nextWeek = '03SUN04MON05TUE06WED07THU08FRI09SAT';

      it('advances to next week on button click', () => {
        expect(subject.find('.planner-header').text()).toContain(currentWeek);
        subject.find('button.next-week').simulate('click');
        expect(subject.find('.planner-header').text()).toContain(nextWeek);
      });

      it('recede to previous week on button click', () => {
        expect(subject.find('.planner-header').text()).toContain(currentWeek);
        subject.find('button.last-week').simulate('click');
        expect(subject.find('.planner-header').text()).toContain(lastWeek);
      });
    });

    describe('multiselect', () => {
      let certificationMultiSelect: ReactWrapper;
      let qualificationMultiSelect: ReactWrapper;

      beforeEach(() => {
        qualificationMultiSelect = subject.find('div.qualifications-multiselect');
        certificationMultiSelect = subject.find('div.certifications-multiselect');
      });

      it('calls the setSelectedQualifications when selecting a single qualification', () => {
        const input = qualificationMultiSelect.find('input');
        input.simulate('click');
        input.simulate('keyDown', {keyCode: 40});
        input.simulate('keyDown', {keyCode: 13});

        expect(subject.find('tbody tr').length).toBeLessThan(12);
      });

      it('calls the setSelectedCertifications when selecting a single certification', () => {
        const input = certificationMultiSelect.find('input');
        input.simulate('click');
        input.simulate('keyDown', {keyCode: 40});
        input.simulate('keyDown', {keyCode: 13});

        expect(subject.find('tbody tr').length).toBeLessThan(12);
      });
    });
  });

  describe('SidePanel', () => {
    it('populates the side panelStore with the selected airman', () => {
      clickOnFirstAirman(subject.find(Roster));
      const sidePanel = subject.find(SidePanel);
      expect(sidePanel.exists()).toBeTruthy();
      expect(sidePanel.text()).toContain(airman.lastName);
      expect(sidePanel.text()).toContain(airman.firstName);
    });

    it('closes the sidepanel', () => {
      clickOnFirstAirman(subject.find(Roster));
      clickButtonByName(subject, SidePanel, 'close');
      expect(subject.find(SidePanel).exists()).toBeFalsy();
    });
  });

  it('renders a delete popup when there is a pending delete event', () => {
    const event = new EventModel('Title', 'Description', moment(), moment(), 1, EventType.Appointment);
    expect(subject.find(StyledDeleteEventPopup).exists()).toBeFalsy();
    trackerStore.removeEvent(event);
    subject.update();
    expect(subject.find(StyledDeleteEventPopup).exists()).toBeTruthy();
  });
});