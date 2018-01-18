import { mount, ReactWrapper } from 'enzyme';
import * as React from 'react';

import { Table } from '../utils/testUtils';
import { Roster } from './Roster';
import AirmanModel from '../airman/models/AirmanModel';
import AirmanModelFactory from '../airman/factories/AirmanModelFactory';
import PlannerServiceStub from '../tracker/services/doubles/PlannerServiceStub';
import CertificationModelFactory from '../airman/factories/CertificationModelFactory';
import CertificationModel from '../airman/models/CertificationModel';
import FilterOptionModel from '../widgets/models/FilterOptionModel';
import { AirmanStore } from '../airman/AirmanStore';
import AirmanRepositoryStub from '../airman/repositories/doubles/AirmanRepositoryStub';
import { SquadronStore } from '../squadron/SquadronStore';
import SquadronRepositoryStub from '../squadron/repositories/doubles/SquadronRepositoryStub';
import { FlightStore } from '../flight/FlightStore';
import { CertificationStore } from '../airman/CertificationStore';
import CertificationRepositoryStub from '../airman/repositories/doubles/CertificationRepositoryStub';
import EventRepositoryStub from '../event/repositories/doubles/EventRepositoryStub';

let airmen: AirmanModel[];
let certifications: CertificationModel[];
let setSelectedCertificationsSpy: (certifications: FilterOptionModel[]) => void;
let table: Table;
let subject: ReactWrapper;
let airmanStore: AirmanStore;

describe('Roster', () => {
  beforeEach(async () => {
    certifications = CertificationModelFactory.buildList(3);

    airmen = [
      AirmanModelFactory.build(1, 1, certifications.slice(0, 1)),
      AirmanModelFactory.build(2, 1, certifications.slice(1, 2)),
      AirmanModelFactory.build(3, 1, certifications.slice(0, 2))
    ];

    setSelectedCertificationsSpy = jest.fn();

    const squadronStore = new SquadronStore(new SquadronRepositoryStub());
    airmanStore = new AirmanStore(
      new AirmanRepositoryStub(),
      squadronStore,
      new FlightStore(squadronStore),
      new CertificationStore(new CertificationRepositoryStub()),
      new EventRepositoryStub()
      );

    airmanStore.setAirmen(airmen);
    subject = mount(
      <Roster
        certifications={certifications}
        airmanStore={airmanStore}
        setSelectedCertifications={setSelectedCertificationsSpy}
        selectedCertificationIds={[]}
        week={new PlannerServiceStub().getCurrentWeek()}
      />
    );
    table = new Table(subject);
  });

  it('renders NAME, QUALIFICATION, CERTIFICATION, and Planner table headers', () => {
    expect(table.getColumnHeaders()).toEqual([
      'NAME',
      'QUALIFICATION',
      'CERTIFICATION',
      'NOVEMBER 2017'
    ]);
    expect(table.getColumnSubHeaders(3)).toEqual('26SUN27MON28TUE29WED30THU01FRI02SAT');
  });

  it('render airmen last names', async () => {
    const expectedLastNames = airmen.map(airman => airman.lastName);

    expect(table.getRowCount()).toEqual(airmen.length);
    expect(table.getTextForRowAndCol(0, 'NAME')).toBe(expectedLastNames[0]);
    expect(table.getTextForRowAndCol(1, 'NAME')).toBe(expectedLastNames[1]);
    expect(table.getTextForRowAndCol(2, 'NAME')).toBe(expectedLastNames[2]);
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
    expect(airmanStore.getSelectedAirman).toEqual(airmen[0]);
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

      expect(setSelectedCertificationsSpy).toHaveBeenCalledWith([{label: '0', value: 0}]);
    });
  });

  it('renders an AvailabilityOverview for every airman', () => {
    expect(table.getAvailabilityOverview().length).toBe(3);
  });
});
