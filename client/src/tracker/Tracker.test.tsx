import * as React from 'react';
import { mount, ReactWrapper } from 'enzyme';
import AirmanRepositoryStub from '../roster/repositories/AirmanRepositoryStub';
import Roster from '../roster/Roster';
import { Tracker, DefaultFilter } from './Tracker';
import { forIt } from '../utils/testUtils';
import Filter from './Filter';
import UnitRepositoryStub from './respositories/UnitRepositoryStub';

const airmanRepositoryStub = new AirmanRepositoryStub();
const unitRepositoryStub = new UnitRepositoryStub();

let subject: ReactWrapper;

describe('Tracker', () => {
  beforeEach(async () => {
    subject = mount(<Tracker airmanRepository={airmanRepositoryStub} unitRepository={unitRepositoryStub}/>);
    await forIt();
    subject.update();
  });

  it('renders a roster with all units', async () => {
    const roster = await airmanRepositoryStub.findAll();
    expect(subject.find(Roster).prop('airmen')).toEqual(roster);
  });

  describe('filtering', () => {
    const unitId = 1;

    let filter: ReactWrapper;

    beforeEach(async () => {
      filter = subject.find(Filter);
      filter.simulate('change', {target: {value: unitId}});
      await forIt();
      subject.update();
    });

    it('can filter a roster by unit', async () => {
      const filteredRoster = await airmanRepositoryStub.findByUnit(unitId);
      expect(subject.find(Roster).prop('airmen')).toEqual(filteredRoster);
    });

    it('can filter a roster by all units', async () => {
      filter.simulate('change', {target: {value: DefaultFilter.value}});
      await forIt();
      subject.update();

      const airmen = await airmanRepositoryStub.findAll();
      expect(subject.find(Roster).prop('airmen')).toEqual(airmen);
    });
  });
});