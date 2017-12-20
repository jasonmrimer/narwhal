import { shallow } from 'enzyme';
import * as React from 'react';

import { Table } from '../utils/testUtils';
import { Roster } from './Roster';
import AirmanModel from '../airman/models/AirmanModel';
import AirmanModelFactory from '../airman/factories/AirmanModelFactory';
import PlannerServiceStub from '../tracker/services/doubles/PlannerServiceStub';

let table: Table;
let airmen: AirmanModel[];
let selectAirmanMock: (airman: AirmanModel) => void;

describe('Roster', () => {
  beforeEach(async () => {
    selectAirmanMock = jest.fn();
    airmen = AirmanModelFactory.buildList();
    const week = new PlannerServiceStub().getCurrentWeek();
    table = new Table(shallow(
      <Roster
        airmen={airmen}
        selectAirman={selectAirmanMock}
        week={week}
      />
    ));
  });

  it('renders NAME, QUALIFICATION, CERTIFICATION, and Planner table headers', () => {
    expect(table.getColumnHeaders()).toEqual([
      'NAME',
      'QUALIFICATION',
      'CERTIFICATION',
      'NOVEMBER 201726SUN27MON28TUE29WED30THU01FRI02SAT'
    ]);
  });

  it('render airmen last names', async () => {
    const expectedLastNames = airmen.map(airman => airman.lastName);

    expect(table.getRowCount()).toEqual(airmen.length);
    expect(table.getTextForRowAndCol(0, 'NAME')).toBe(expectedLastNames[0]);
    expect(table.getTextForRowAndCol(1, 'NAME')).toBe(expectedLastNames[1]);
    expect(table.getTextForRowAndCol(2, 'NAME')).toBe(expectedLastNames[2]);
  });

  it('renders airmen qualification', () => {
    const expectedQualifications = 'MMS / I / E';
    expect(table.getTextForRowAndCol(0, 'QUALIFICATION')).toBe(expectedQualifications);
  });

  it('renders airmen certification', () => {
    const expectedCertification = 'Laser Vision / Flight / Super Speed';
    expect(table.getTextForRowAndCol(0, 'CERTIFICATION')).toBe(expectedCertification);
  });

  it('calls the selectAirman when clicking on an airman', () => {
    table.getRows().at(0).simulate('click');
    expect(selectAirmanMock).toBeCalledWith(airmen[0]);
  });
});
