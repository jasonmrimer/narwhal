import { mount, ReactWrapper } from 'enzyme';
import * as React from 'react';

import { forIt } from '../utils/testUtils';
import { Roster } from './Roster';
import RosterRepositoryStub from './RosterRepositoryStub';

const repositoryStub = new RosterRepositoryStub();

let subject: ReactWrapper;

describe('Roster', () => {
  beforeEach(async () => {
    subject = mount(<Roster rosterRepository={repositoryStub}/>);
    await forIt();
    subject.update();
  });

  it('renders NAME table header', () => {
    expect(subject.find('th').at(0).text()).toEqual('NAME');
  });

  it('render a table row for each airman', async () => {
    const {airmen} = await repositoryStub.findOne();
    const lastNames = airmen.map(airman => airman.lastName);

    const rows = subject.find('td');
    expect(rows.length).toEqual(airmen.length);
    rows.forEach((row) => {
      expect(lastNames).toContain(row.text());
    });
  });
});