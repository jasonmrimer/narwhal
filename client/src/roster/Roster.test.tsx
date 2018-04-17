import { makeFakeTrackerStore } from '../utils/testUtils';
import { mount, ReactWrapper } from 'enzyme';
import { BorderedNotification } from '../widgets/Notification';
import { Roster, StyledRow } from './Roster';
import { AirmanDatum } from '../tracker/AirmanDatum';
import { TabType } from '../tracker/stores/SidePanelStore';
import { TrackerStore } from '../tracker/stores/TrackerStore';
import * as React from 'react';
import { AirmanModel } from '../airman/models/AirmanModel';
import { StyledShiftDropdown } from '../tracker/ShiftDropdown';

describe('Roster', () => {
  let trackerStore: TrackerStore;
  let subject: ReactWrapper;
  let airmen: AirmanModel[];

  describe('when the list of airmen is empty', () => {
    beforeEach(async () => {
      trackerStore = await makeFakeTrackerStore(false);
      subject = mount(<Roster trackerStore={trackerStore}/>);
    });

    it('should return a message', () => {
      expect(trackerStore.airmen.length).toBe(0);
      expect(subject.find(BorderedNotification).exists()).toBeTruthy();
    });

  });

  describe('when this list of airmen is not empty', () => {
    beforeEach(async () => {
      trackerStore = await makeFakeTrackerStore();
      subject = mount(<Roster trackerStore={trackerStore}/>);
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
