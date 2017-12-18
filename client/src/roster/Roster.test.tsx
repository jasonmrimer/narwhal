import { shallow, ShallowWrapper } from 'enzyme';
import * as React from 'react';

import { Table } from '../utils/testUtils';
import { Roster } from './Roster';
import AirmanRepositoryStub from '../airman/repositories/doubles/AirmanRepositoryStub';
import AirmanModel from '../airman/models/AirmanModel';

const repositoryStub = new AirmanRepositoryStub();

let subject: ShallowWrapper, table: Table, airmen: AirmanModel[], selectAirmanMock: (airman: AirmanModel) => void;

describe('Roster', () => {
  beforeEach(async () => {
    selectAirmanMock = jest.fn();
    airmen = await repositoryStub.findAll();
    subject = shallow(<Roster airmen={airmen} selectAirman={selectAirmanMock}/>);
    table = new Table(subject);
  });

  it('renders NAME, QUALIFICATION, and CERTIFICATION table header', () => {
    expect(table.getColumnHeaders()).toEqual(['NAME', 'QUALIFICATION', 'CERTIFICATION']);
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

  it('calls the selectAirman when click on an airman', () => {
    table.getRows().at(0).simulate('click');
    expect(selectAirmanMock).toBeCalledWith(airmen[0]);
  });

});
