import * as React from 'react';
import { mount, ReactWrapper } from 'enzyme';
import { Tracker } from './Tracker';
import { clickButtonByName, clickOnFirstAirman, forIt, makeFakeTrackerStore } from '../utils/testUtils';
import { SidePanel } from './SidePanel';
import { TrackerStore } from './stores/TrackerStore';
import { AirmanModel } from '../airman/models/AirmanModel';
import { MemoryRouter } from 'react-router';
import { RosterBody } from '../roster/RosterBody';
import { Theme } from '../themes/default';
import { ThemeProvider } from 'styled-components';

let trackerStore: TrackerStore;
let subject: ReactWrapper;
let airman: AirmanModel;

describe('Tracker', () => {
  beforeEach(async () => {
    trackerStore = await makeFakeTrackerStore();
    subject = mount(
      <ThemeProvider theme={Theme}>
        <MemoryRouter>
          <Tracker
            profile={{id: 1, username: 'Tytus', siteId: 1}}
            trackerStore={trackerStore}
          />
        </MemoryRouter>
      </ThemeProvider>
    );
    await forIt();
    subject.update();

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

    describe('multitypeahead', () => {
      let certificationMultiTypeahead: ReactWrapper;
      let qualificationMultiTypeahead: ReactWrapper;

      beforeEach(() => {
        qualificationMultiTypeahead = subject.find('div.qualifications-multitypeahead');
        certificationMultiTypeahead = subject.find('div.certifications-multitypeahead');
      });

      it('calls the setSelectedQualificationOptions when selecting a single qualification', () => {
        const input = qualificationMultiTypeahead.find('input');
        input.simulate('click');
        input.simulate('keyDown', {keyCode: 40});
        input.simulate('keyDown', {keyCode: 13});

        expect(subject.find('tbody tr').length).toBeLessThan(12);
      });

      it('calls the setSelectedCertificationOptions when selecting a single certification', () => {
        const input = certificationMultiTypeahead.find('input');
        input.simulate('click');
        input.simulate('keyDown', {keyCode: 40});
        input.simulate('keyDown', {keyCode: 13});

        expect(subject.find('tbody tr').length).toBeLessThan(12);
      });
    });
  });

  describe('SidePanel', () => {
    it('populates the side panelStore with the selected airman', () => {
      clickOnFirstAirman(subject.find(RosterBody));
      const sidePanel = subject.find(SidePanel);
      expect(sidePanel.exists()).toBeTruthy();
      expect(sidePanel.text()).toContain(airman.lastName);
      expect(sidePanel.text()).toContain(airman.firstName);
    });

    it('closes the sidepanel', () => {
      clickOnFirstAirman(subject.find(RosterBody));
      clickButtonByName(subject, SidePanel, 'close');
      expect(subject.find(SidePanel).exists()).toBeFalsy();
    });
  });
});