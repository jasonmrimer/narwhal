import { mount, ReactWrapper } from 'enzyme';
import * as React from 'react';

import { makeFakeTrackerStore, Table } from '../utils/testUtils';
import { Roster } from './Roster';
import AirmanModel from '../airman/models/AirmanModel';
import CertificationModel from '../airman/models/CertificationModel';
import TrackerStore from '../tracker/stores/TrackerStore';

let airmen: AirmanModel[];
let certifications: CertificationModel[];
let table: Table;
let trackerStore: TrackerStore;
let subject: ReactWrapper;

describe('Roster', () => {
  beforeEach(async () => {
    trackerStore = await makeFakeTrackerStore();
    airmen = trackerStore.airmen;
    certifications = trackerStore.certifications;

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
      '',
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
    const expectedQualifications = airmen[0].qualifications.map(qual => qual.acronym).join(' / ');
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
    let multiSelect: ReactWrapper;

    beforeEach(() => {
      multiSelect = subject.find('Select');
    });

    it('renders multiple certfications', () => {
      const certificationOptions = certifications.map(certification => {
        return {value: certification.id, label: certification.title};
      });
      expect(multiSelect.prop('options')).toEqual(certificationOptions);
    });

    it('calls the setSelectedCertifications when selecting a single certification', () => {
      const input = multiSelect.find('input');
      input.simulate('keyDown', {keyCode: 40});
      input.simulate('keyDown', {keyCode: 13});
      subject.update();

      expect(trackerStore.certificationIds).toEqual([0]);
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
  });
});
