import { shallow, ShallowWrapper } from 'enzyme';
import * as React from 'react';
import { findByClassName, makeFakeTrackerStore, Table } from '../utils/testUtils';
import { Roster } from './Roster';
import { AirmanModel } from '../airman/models/AirmanModel';
import { CertificationModel } from '../skills/models/CertificationModel';
import { TrackerStore } from '../tracker/stores/TrackerStore';
import { QualificationModel } from '../skills/models/QualificationModel';
import { StyledNotification } from '../widgets/Notification';
import { StyledPlannerHeader } from '../widgets/PlannerHeader';
import { StyledMultiTypeahead } from '../widgets/MultiTypeahead';
import { StyledPlanner } from './Planner';
import { AirmanDatum } from '../tracker/AirmanDatum';
import { ShiftDisplay } from './ShiftDisplay';
import { TabType } from '../tracker/stores/SidePanelStore';

let airmen: AirmanModel[];
let certifications: CertificationModel[];
let qualifications: QualificationModel[];
let table: Table;
let trackerStore: TrackerStore;
let subject: ShallowWrapper;

describe('Roster', () => {
  describe('when the list of airmen is empty', () => {
    beforeEach(async () => {
      trackerStore = await makeFakeTrackerStore(false);
      subject = shallow(<Roster trackerStore={trackerStore}/>);
    });

    it('should return a message', () => {
      expect(subject.find('tbody tr').length).toEqual(0);
      const notification = subject.find(StyledNotification);
      expect(notification.exists()).toBeTruthy();
    });
  });

  describe('when the list of airmen is not empty', () => {
    beforeEach(async () => {
      trackerStore = await makeFakeTrackerStore();
      airmen = trackerStore.airmen;
      certifications = trackerStore.certifications;
      qualifications = trackerStore.qualifications;

      subject = shallow(<Roster trackerStore={trackerStore}/>);
      table = new Table(subject);
    });

    it('renders SHIFT, NAME, QUALIFICATION, CERTIFICATION, and Planner table headers', () => {
      const columnHeaders = ['SHIFT', 'NAME', 'QUALIFICATION', 'CERTIFICATION'];
      expect(table.getColumnHeaders()).toEqual(columnHeaders);
      expect(subject.find(StyledPlannerHeader).exists()).toBeTruthy();
    });

    it('renders AirmanDatum components', () => {
      const airmanDataCount = 3 * airmen.length;
      expect(subject.find(AirmanDatum).length).toBe(airmanDataCount);
    });

    it('renders airmen shifts', () => {
      const expectedShifts = airmen.map(airman => airman.shift);
      expect(table.getRowCount()).toEqual(airmen.length);
      table.getRows().forEach((row: ShallowWrapper, index: number) => {
        expect(row.find(ShiftDisplay).prop('shift')).toBe(expectedShifts[index]);
      });
    });

    it('renders airmen names', () => {
      const expectedFullNames = airmen.map(airman => `${airman.lastName}, ${airman.firstName}`);

      expect(table.getRowCount()).toEqual(airmen.length);

      table.getRows().forEach((row: ShallowWrapper, index: number) => {
        expect(row.find(AirmanDatum).at(0).prop('airman')).toEqual(airmen[index]);
        expect(row.find(AirmanDatum).at(0).prop('text')).toEqual(expectedFullNames[index]);
        expect(row.find(AirmanDatum).at(0).prop('tab')).toEqual(TabType.AVAILABILITY);
      });
    });

    it('renders airmen qualification', () => {
      table.getRows().forEach((row: ShallowWrapper, index: number) => {
        const expectedQualifications = airmen[index].qualifications.map(qual => qual.qualification.acronym).join(' / ');
        expect(row.find(AirmanDatum).at(1).prop('airman')).toEqual(airmen[index]);
        expect(row.find(AirmanDatum).at(1).prop('text')).toEqual(expectedQualifications);
        expect(row.find(AirmanDatum).at(1).prop('tab')).toEqual(TabType.CURRENCY);
      });
    });

    it('renders airmen certification', () => {
      table.getRows().forEach((row: ShallowWrapper, index: number) => {
        const expectedCertification = airmen[index].certifications.map(cert => cert.title).join(' / ');
        expect(row.find(AirmanDatum).at(2).prop('airman')).toEqual(airmen[index]);
        expect(row.find(AirmanDatum).at(2).prop('text')).toEqual(expectedCertification);
        expect(row.find(AirmanDatum).at(2).prop('tab')).toEqual(TabType.CURRENCY);
      });
    });

    describe('multiselect', () => {
      let certificationMultiSelect: ShallowWrapper;
      let qualificationMultiSelect: ShallowWrapper;

      beforeEach(() => {
        const multiselects = subject.find(StyledMultiTypeahead);
        qualificationMultiSelect = findByClassName(multiselects, 'qualifications-multiselect');
        certificationMultiSelect = findByClassName(multiselects, 'certifications-multiselect');
      });

      it('renders multiple qualifications', () => {
        const qualificationOptions = qualifications.map(qualification => {
          return {value: qualification.id, label: `${qualification.acronym}`};
        });

        expect(qualificationMultiSelect.prop('options')).toEqual(qualificationOptions);
      });

      it('renders multiple certifications', () => {
        const certificationOptions = certifications.map(certification => {
          return {value: certification.id, label: certification.title};
        });
        expect(certificationMultiSelect.prop('options')).toEqual(certificationOptions);
      });
    });

    describe('planner', () => {
      it('renders a Planner for every airman', () => {
        expect(table.getPlanner().length).toBe(airmen.length);
      });

      it('passes Planner an airman and trackerStore', () => {
        expect(subject.find(StyledPlanner).at(0).prop('airman')).toBe(airmen[0]);
        expect(subject.find(StyledPlanner).at(0).prop('trackerStore')).toBe(trackerStore);
      });
    });
  });
});
