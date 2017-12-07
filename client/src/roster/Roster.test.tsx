import {mount, ReactWrapper} from 'enzyme';
import * as React from 'react';

import {forIt, Table} from '../utils/testUtils';
import {Roster} from './Roster';
import RosterRepositoryStub from './RosterRepositoryStub';

const repositoryStub = new RosterRepositoryStub();

let subject: ReactWrapper, table: Table;

describe('Roster', () => {
  beforeEach(async () => {
    subject = mount(<Roster rosterRepository={repositoryStub}/>);
    await forIt();
    subject.update();
    table = new Table(subject);
  });

  it('renders NAME and QUALIFICATIONS table header', () => {
    expect(table.getColumnHeaders()).toEqual(['NAME', 'QUALIFICATIONS']);
  });

  it('render airmen last names', async () => {
    const {airmen} = await repositoryStub.findOne();
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
