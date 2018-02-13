import { mount, ReactWrapper } from 'enzyme';
import * as React from 'react';
import { makeFakeTrackerStore, Table } from '../utils/testUtils';
import { Roster } from './Roster';
import AirmanModel from '../airman/models/AirmanModel';
import CertificationModel from '../skills/models/CertificationModel';
import TrackerStore from '../tracker/stores/TrackerStore';
import QualificationModel from '../skills/models/QualificationModel';
import Notification from '../widgets/Notification';

let airmen: AirmanModel[];
let certifications: CertificationModel[];
let qualifications: QualificationModel[];
let table: Table;
let trackerStore: TrackerStore;
let subject: ReactWrapper;

describe('Roster', () => {
  describe('when the list of airmen is empty', () => {
    beforeEach(async () => {
      trackerStore = await makeFakeTrackerStore(false);
      subject = mount(<Roster trackerStore={trackerStore}/>);
    });

    it('should return a message', () => {
      expect(subject.find('tbody tr').length).toEqual(0);
      const notification = subject.find(Notification);
      expect(notification.exists()).toBeTruthy();
      expect(notification.text()).toContain('No members at this location match your search.');
    });
  });

  describe('when the list of airmen is not empty', () => {
    beforeEach(async () => {
      trackerStore = await makeFakeTrackerStore();
      airmen = trackerStore.airmen;
      certifications = trackerStore.certifications;
      qualifications = trackerStore.qualifications;

      subject = mount(
        <Roster
          trackerStore={trackerStore}
        />
      );
      table = new Table(subject);
    });

    it('renders NAME, QUALIFICATION, CERTIFICATION, and Planner table headers', () => {
      expect(table.getColumnHeaders()).toEqual([
        'NAME',
        'QUALIFICATION',
        'CERTIFICATION',
        'NOVEMBER 2017',
      ]);
      expect(table.getColumnSubHeaders(3)).toEqual('26SUN27MON28TUE29WED30THU01FRI02SAT');
      expect(subject.find('button.next-week').exists()).toBeTruthy();
    });

    it('render airmen last names', async () => {
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

    it('calls the selectAirman when clicking on an airman', () => {
      table.getRows().at(0).simulate('click');
      expect(trackerStore.selectedAirman).toEqual(airmen[0]);
    });

    describe('multiselect', () => {
      let certificationMultiSelect: ReactWrapper;
      let qualificationMultiSelect: ReactWrapper;

      beforeEach(() => {
        qualificationMultiSelect = subject.find('div.qualifications-multiselect');
        certificationMultiSelect = subject.find('div.certifications-multiselect');
      });

      it('renders multiple qualifications', () => {
        const qualificationOptions = qualifications.map(qualification => {
          return {value: qualification.id, label: qualification.acronym};
        });
        expect(qualificationMultiSelect.children().prop('options')).toEqual(qualificationOptions);
      });

      it('calls the setSelectedQualifications when selecting a single qualification', () => {
        const input = qualificationMultiSelect.find('input');
        input.simulate('click');
        input.simulate('keyDown', {keyCode: 40});
        input.simulate('keyDown', {keyCode: 13});
        const tokens = subject.find('.rbt-token');
        expect(tokens.length).toBe(1);
      });

      it('renders multiple certifications', () => {
        const certificationOptions = certifications.map(certification => {
          return {value: certification.id, label: certification.title};
        });
        expect(certificationMultiSelect.children().prop('options')).toEqual(certificationOptions);
      });

      it('calls the setSelectedCertifications when selecting a single certification', () => {
        const input = certificationMultiSelect.find('input');
        input.simulate('click');
        input.simulate('keyDown', {keyCode: 40});
        input.simulate('keyDown', {keyCode: 13});
        const tokens = subject.find('.rbt-token');
        expect(tokens.length).toBe(1);
      });
    });

    describe('planner', () => {
      it('renders an Planner for every airman', () => {
        expect(table.getPlanner().length).toBe(airmen.length);
      });

      it('advances to next week on button click', () => {
        subject.find('button.next-week').simulate('click');
        expect(table.getColumnSubHeaders(3)).toEqual('03SUN04MON05TUE06WED07THU08FRI09SAT');
      });

      it('advances to last week on button click', () => {
        subject.find('button.last-week').simulate('click');
        expect(table.getColumnSubHeaders(3)).toEqual('19SUN20MON21TUE22WED23THU24FRI25SAT');
      });
    });
  });
});
