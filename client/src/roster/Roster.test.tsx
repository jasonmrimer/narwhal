import { shallow, ShallowWrapper } from 'enzyme';
import * as React from 'react';

import { Table } from '../utils/testUtils';
import { Roster } from './Roster';
import AirmanRepositoryStub from './repositories/AirmanRepositoryStub';
import AirmanModel from './models/AirmanModel';

const repositoryStub = new AirmanRepositoryStub();

let subject: ShallowWrapper, table: Table, airmen: AirmanModel[];

describe('Roster', () => {
  beforeEach(async () => {
    airmen = await repositoryStub.findAll();
    subject = shallow(<Roster airmen={airmen}/>);
    table = new Table(subject);
  });

  it('renders NAME and QUALIFICATIONS table header', () => {
    expect(table.getColumnHeaders()).toEqual(['NAME', 'QUALIFICATIONS']);
  });

  it('render airmen last names', async () => {
    const expectedLastNames = airmen.map(airman => airman.lastName);

    expect(table.getRowCount()).toEqual(airmen.length);
    expect(table.getTextForRowAndCol(0, 'NAME')).toBe(expectedLastNames[0]);
    expect(table.getTextForRowAndCol(1, 'NAME')).toBe(expectedLastNames[1]);
    expect(table.getTextForRowAndCol(2, 'NAME')).toBe(expectedLastNames[2]);
  });

  it('renders airmen qualifications', () => {
    const expectedQualifications = 'MMS / I / E';
    expect(table.getTextForRowAndCol(0, 'QUALIFICATIONS')).toBe(expectedQualifications);
  });
});
