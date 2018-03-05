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

    it('renders NAME, QUALIFICATION, CERTIFICATION, and Planner table headers', () => {
      const columnHeaders = ['NAME', 'QUALIFICATION', 'CERTIFICATION'];
      expect(table.getColumnHeaders()).toEqual(columnHeaders);
      expect(subject.find(StyledPlannerHeader).exists()).toBeTruthy();
    });

    it('renders AirmanDatum components', () => {
      const airmanDataCount = 3 * airmen.length;
      expect(subject.find(AirmanDatum).length).toBe(airmanDataCount);
    });

    it('renders airmen names', async () => {
      const expectedFullNames = airmen.map(airman => `${airman.lastName}, ${airman.firstName}`);

      expect(table.getRowCount()).toEqual(airmen.length);
      for (let i = 0; i < table.getRowCount(); i++) {
        expect(table.getTextForRowAndCol(i, 'NAME')).toBe(expectedFullNames[i]);
      }
    });

    it('renders airmen qualification', () => {
      const expectedQualifications = airmen[0].qualifications.map(qual => qual.qualification.acronym).join(' / ');
      expect(table.getTextForRowAndCol(0, 'QUALIFICATION')).toBe(expectedQualifications);
    });

    it('renders airmen certification', () => {
      const expectedCertification = airmen[0].certifications.map(cert => cert.title).join(' / ');
      expect(table.getTextForRowAndCol(0, 'CERTIFICATION')).toBe(expectedCertification);
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
