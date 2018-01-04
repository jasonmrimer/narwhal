import * as React from 'react';
import { mount, ReactWrapper } from 'enzyme';
import AirmanRepositoryStub from '../airman/repositories/doubles/AirmanRepositoryStub';
import Roster from '../roster/Roster';
import { DefaultFilter, Tracker } from './Tracker';
import { forIt } from '../utils/testUtils';
import Filter from '../widgets/Filter';
import UnitRepositoryStub from '../unit/repositories/doubles/UnitRepositoryStub';
import SidePanel from '../widgets/SidePanel';
import AirmanModel from '../airman/models/AirmanModel';
import PlannerServiceStub from './services/doubles/PlannerServiceStub';
import TopBar from '../widgets/TopBar';

const airmanRepositoryStub = new AirmanRepositoryStub();
const unitRepositoryStub = new UnitRepositoryStub();
const plannerServiceStub = new PlannerServiceStub();

let subject: ReactWrapper, airmen: AirmanModel[];

describe('Tracker', () => {
  beforeEach(async () => {
    subject = mount(
      <Tracker
        username="Tytus"
        airmanRepository={airmanRepositoryStub}
        unitRepository={unitRepositoryStub}
        plannerService={plannerServiceStub}
      />
    );
    airmen = await airmanRepositoryStub.findAll();
    await forIt();
    subject.update();
  });

  it('renders a Roster with all units', async () => {
    expect(subject.find(Roster).prop('airmen')).toEqual(airmen);
  });

  it('renders a Roster with the current week', async () => {
    expect(subject.find(Roster).prop('week')).toEqual(plannerServiceStub.getCurrentWeek());
  });

  it('renders the TopBar with a username and pageTitle', async () => {
    expect(subject.find(TopBar).prop('username')).toBe('Tytus');
    expect(subject.find(TopBar).prop('pageTitle')).toBe('AVAILABILITY ROSTER');
  });

  describe('the sidepanel', () => {
    it('does not render by default', () => {
      expect(subject.find(SidePanel).exists()).toBeFalsy();
    });

    it('shows airman details', () => {
      subject.find(Roster).find('tbody tr').at(0).simulate('click');
      expect(subject.find(SidePanel).prop('airman')).toEqual(airmen[0]);
    });

    it('closes the sidepanel', () => {
      subject.find(Roster).find('tbody tr').at(0).simulate('click');
      subject.find(SidePanel).find('button').simulate('click');
      expect(subject.find(SidePanel).exists()).toBeFalsy();
    });
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

      expect(subject.find(Roster).prop('airmen')).toEqual(airmen);
    });
  });
});
