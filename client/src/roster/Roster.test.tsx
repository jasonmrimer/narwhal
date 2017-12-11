import { shallow, ShallowWrapper } from 'enzyme';
import * as React from 'react';

import { Table } from '../utils/testUtils';
import { Roster } from './Roster';
import RosterRepositoryStub from './repositories/RosterRepositoryStub';
import RosterModel from './models/RosterModel';

const repositoryStub = new RosterRepositoryStub();

let subject: ShallowWrapper, table: Table, roster: RosterModel;

describe('Roster', () => {
  beforeEach(async () => {
    roster = await repositoryStub.findOne();
    subject = shallow(<Roster roster={roster}/>);
    table = new Table(subject);
  });

  it('renders NAME and QUALIFICATIONS table header', () => {
    expect(table.getColumnHeaders()).toEqual(['NAME', 'QUALIFICATIONS']);
  });

  it('render airmen last names', async () => {
    const expectedLastNames = roster.airmen.map(airman => airman.lastName);

    expect(table.getRowCount()).toEqual(roster.airmen.length);
    expect(table.getTextForRowAndCol(0, 'NAME')).toBe(expectedLastNames[0]);
    expect(table.getTextForRowAndCol(1, 'NAME')).toBe(expectedLastNames[1]);
    expect(table.getTextForRowAndCol(2, 'NAME')).toBe(expectedLastNames[2]);
  });

  it('renders airmen qualifications', () => {
    const expectedQualifications = 'MMS / I / E';
    expect(table.getTextForRowAndCol(0, 'QUALIFICATIONS')).toBe(expectedQualifications);
  });
});
