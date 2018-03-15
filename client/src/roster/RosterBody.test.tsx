import { makeFakeTrackerStore } from '../utils/testUtils';
import { shallow, ShallowWrapper } from 'enzyme';
import { StyledNotification } from '../widgets/Notification';
import { RosterBody } from './RosterBody';
import { AirmanDatum } from '../tracker/AirmanDatum';
import { TabType } from '../tracker/stores/SidePanelStore';
import { TrackerStore } from '../tracker/stores/TrackerStore';
import * as React from 'react';
import { AirmanModel } from '../airman/models/AirmanModel';

describe('RosterBody', () => {
  describe('when the list of airmen is empty', () => {
    let trackerStore: TrackerStore;
    let subject: ShallowWrapper;
    let airmen: AirmanModel[];

    beforeEach(async () => {
      trackerStore = await makeFakeTrackerStore(false);
      subject = shallow(<RosterBody trackerStore={trackerStore}/>);
      airmen = trackerStore.airmen;
    });

    it('should return a message', () => {
      expect(subject.find('.airman-name').length).toEqual(0);
      const notification = subject.find(StyledNotification);
      expect(notification.exists()).toBeTruthy();
    });

    it('renders AirmanDatum components', () => {
      const airmanDataCount = 3 * airmen.length;
      expect(subject.find(AirmanDatum).length).toBe(airmanDataCount);
    });

    it('renders airmen shifts', () => {
      const expectedShifts = airmen.map(airman => airman.shift);
      expect(subject.find('.shift').length).toBe(expectedShifts.length);
    });

    it('renders airmen names', () => {
      const expectedFullNames = airmen.map(airman => `${airman.lastName}, ${airman.firstName}`);
      subject.find('.tr').forEach((airman: ShallowWrapper, index: number) => {
        expect(airman.find(AirmanDatum).at(0).prop('airman')).toEqual(airmen[index]);
        expect(airman.find(AirmanDatum).at(0).prop('text')).toEqual(expectedFullNames[index]);
        expect(airman.find(AirmanDatum).at(0).prop('tab')).toEqual(TabType.AVAILABILITY);
      });
    });

    it('renders airmen qualification', () => {
      subject.find('.tr').forEach((row: ShallowWrapper, index: number) => {
        const expectedQualifications = airmen[index].qualifications.map(qual => qual.qualification.acronym).join(' / ');
        expect(row.find(AirmanDatum).at(1).prop('airman')).toEqual(airmen[index]);
        expect(row.find(AirmanDatum).at(1).prop('text')).toEqual(expectedQualifications);
        expect(row.find(AirmanDatum).at(1).prop('tab')).toEqual(TabType.CURRENCY);
      });
    });

    it('renders airmen certification', () => {
      subject.find('.tr').forEach((row: ShallowWrapper, index: number) => {
        const expectedCertification = airmen[index].certifications.map(cert => cert.title).join(' / ');
        expect(row.find(AirmanDatum).at(2).prop('airman')).toEqual(airmen[index]);
        expect(row.find(AirmanDatum).at(2).prop('text')).toEqual(expectedCertification);
        expect(row.find(AirmanDatum).at(2).prop('tab')).toEqual(TabType.CURRENCY);
      });
    });
  });
});
