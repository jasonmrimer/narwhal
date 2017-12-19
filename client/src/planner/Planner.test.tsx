import * as React from 'react';
import { Planner } from './Planner';
import { shallow } from 'enzyme';
import AirmanModelFactory from '../airman/factories/AirmanModelFactory';
import { Table } from '../utils/testUtils';

describe('Planner', () => {
  const airmen = AirmanModelFactory.buildList();
  let table: Table;

  beforeEach(() => {
    const subject = shallow(<Planner airmen={airmen}/>);
    table = new Table(subject);
  });

  it('renders the days of the week', () => {
    expect(table.getColumnHeaders()).toEqual(['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']);
  });

  it('renders a row for each airman', () => {
    expect(table.getRowCount()).toEqual(airmen.length);
  });
});