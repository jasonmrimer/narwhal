import { mount, ReactWrapper } from 'enzyme';
import { BorderedNotification } from '../widgets/Notification';
import { Roster, StyledRoster, StyledRow } from './Roster';
import { AirmanDatum } from '../tracker/AirmanDatum';
import { SidePanelStore, TabType } from '../tracker/stores/SidePanelStore';
import { TrackerStore } from '../tracker/stores/TrackerStore';
import * as React from 'react';
import { AirmanModel } from '../airman/models/AirmanModel';
import { StyledShiftDropdown } from '../tracker/ShiftDropdown';
import { DoubleRepositories } from '../utils/Repositories';
import { LocationFilterStore } from '../widgets/stores/LocationFilterStore';
import { RosterHeaderStore } from './stores/RosterHeaderStore';
import { AirmanModelFactory } from '../airman/factories/AirmanModelFactory';
import { EventModelFactory } from '../event/factories/EventModelFactory';
import { Provider } from 'mobx-react';
import { AvailabilityStore } from '../availability/stores/AvailabilityStore';
import { CurrencyStore } from '../currency/stores/CurrencyStore';
import { PlannerStore } from './stores/PlannerStore';
import { TimeServiceStub } from '../tracker/services/doubles/TimeServiceStub';
import { ProfileSitePickerStore } from '../profile/stores/ProfileSitePickerStore';
import { makeFakeProfile } from '../utils/testUtils';
import { adminAbility } from '../app/abilities';
import { SkillsFieldStore } from "../skills/stores/SkillsFieldStore";
import { Theme } from "../themes/default";
import { ThemeProvider } from "styled-components";
import { MemoryRouter } from "react-router";

describe('Roster', () => {
  let trackerStore: TrackerStore;
  let locationFilterStore: LocationFilterStore;
  let rosterHeaderStore: RosterHeaderStore;
  let subject: ReactWrapper;
  let airmen: AirmanModel[];
  let skillsFieldStore: SkillsFieldStore;

  describe('when the list of airmen is empty', () => {
    beforeEach(async () => {
      trackerStore = new TrackerStore(DoubleRepositories);
      rosterHeaderStore = new RosterHeaderStore();
      locationFilterStore = new LocationFilterStore();
      skillsFieldStore = new SkillsFieldStore();
      subject = mount(
        <ThemeProvider theme={Theme}>
          <MemoryRouter>
        <Provider skillsFieldStore={skillsFieldStore }>
        <Roster
          trackerStore={trackerStore}
          rosterHeaderStore={rosterHeaderStore}
          locationFilterStore={locationFilterStore}
        />
        </Provider>
          </MemoryRouter>
        </ThemeProvider>
      );
    });

    it('should return a message', () => {
      expect(trackerStore.airmen.length).toBe(0);
      expect(subject.find(BorderedNotification).exists()).toBeTruthy();
    });
  });

  describe('when this list of airmen is not empty', () => {
    beforeEach(() => {
      trackerStore = new TrackerStore(DoubleRepositories);
      rosterHeaderStore = new RosterHeaderStore();
      locationFilterStore = new LocationFilterStore();
      const availabilityStore = new AvailabilityStore(DoubleRepositories);
      const sidePanelStore = new SidePanelStore();
      const currencyStore = new CurrencyStore(DoubleRepositories);
      const plannerStore = new PlannerStore(new TimeServiceStub());
      const profileStore = new ProfileSitePickerStore(DoubleRepositories);
      let airman = AirmanModelFactory.build(1);
      let event = EventModelFactory.build();

      profileStore.hydrate([], makeFakeProfile('ADMIN', adminAbility));
      trackerStore.hydrate([airman], [event], airman.siteId);

      subject = mount(
        <Provider
          trackerStore={trackerStore}
          rosterHeaderStore={rosterHeaderStore}
          locationFilterStore={locationFilterStore}
          availabilityStore={availabilityStore}
          sidePanelStore={sidePanelStore}
          currencyStore={currencyStore}
          plannerStore={plannerStore}
          profileStore={profileStore}
          sidePanelActions={null}
          skillsFieldStore={skillsFieldStore}
        >
          <StyledRoster/>
        </Provider>
      );

      airmen = trackerStore.airmen;
    });

    it('renders AirmanDatum components', () => {
      const airmanDataCount = 3 * airmen.length;
      expect(subject.find(AirmanDatum).length).toBe(airmanDataCount);
    });

    it('renders airmen shifts', () => {
      const expectedShifts = airmen.map(airman => airman.shift);
      expect(subject.find(StyledShiftDropdown).length).toBe(expectedShifts.length);
    });

    it('renders airmen names', () => {
      const expectedFullNames = airmen.map(airman => `${airman.lastName}, ${airman.firstName}`);
      subject.find(StyledRow).forEach((airman: ReactWrapper, index: number) => {
        expect(airman.find(AirmanDatum).at(0).prop('airman')).toEqual(airmen[index]);
        expect(airman.find(AirmanDatum).at(0).children().text()).toEqual(expectedFullNames[index]);
        expect(airman.find(AirmanDatum).at(0).prop('tab')).toEqual(TabType.AVAILABILITY);
      });
    });

    it('renders airmen qualification', () => {
      subject.find(StyledRow).forEach((row: ReactWrapper, index: number) => {
        const expectedQualifications = airmen[index].qualifications.map(qual => qual.qualification.acronym).join(' / ');
        expect(row.find(AirmanDatum).at(1).prop('airman')).toEqual(airmen[index]);
        expect(row.find(AirmanDatum).at(1).children().text()).toEqual(expectedQualifications);
        expect(row.find(AirmanDatum).at(1).prop('tab')).toEqual(TabType.CURRENCY);
      });
    });

    it('renders airmen certification', () => {
      subject.find(StyledRow).forEach((row: ReactWrapper, index: number) => {
        const expectedCertification = airmen[index].certifications.map(cert => cert.title).join(' / ');
        expect(row.find(AirmanDatum).at(2).prop('airman')).toEqual(airmen[index]);
        expect(row.find(AirmanDatum).at(2).children().text()).toEqual(expectedCertification);
        expect(row.find(AirmanDatum).at(2).prop('tab')).toEqual(TabType.CURRENCY);
      });
    });
  });
});
