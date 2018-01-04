import * as React from 'react';
import { mount, ReactWrapper } from 'enzyme';
import AirmanRepositoryStub from '../airman/repositories/doubles/AirmanRepositoryStub';
import Roster from '../roster/Roster';
import { Tracker } from './Tracker';
import { forIt } from '../utils/testUtils';
import UnitRepositoryStub from '../unit/repositories/doubles/UnitRepositoryStub';
import SidePanel from '../widgets/SidePanel';
import AirmanModel from '../airman/models/AirmanModel';
import PlannerServiceStub from './services/doubles/PlannerServiceStub';
import TopBar from '../widgets/TopBar';
import { Filter } from '../widgets/Filter';
import CrewRepositoryStub from '../crew/repositories/doubles/CrewRepositoryStub';
import createDefaultOption from '../utils/createDefaultOption';

const airmanRepositoryStub = new AirmanRepositoryStub();
const unitRepositoryStub = new UnitRepositoryStub();
const plannerServiceStub = new PlannerServiceStub();
const crewRepository = new CrewRepositoryStub();
let subject: ReactWrapper, airmen: AirmanModel[];

describe('Tracker', () => {
  beforeEach(async () => {
    subject = mount(
      <Tracker
        username="Tytus"
        airmanRepository={airmanRepositoryStub}
        unitRepository={unitRepositoryStub}
        plannerService={plannerServiceStub}
        crewRepository={crewRepository}
      />
    );
    airmen = await airmanRepositoryStub.findAll();
    await forIt();
    subject.update();
  });

  it('renders a Roster with all units and all crew', async () => {
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

  it('renders the TopBar with a username and pageTitle', async () => {
    expect(subject.find(TopBar).prop('username')).toBe('Tytus');
    expect(subject.find(TopBar).prop('pageTitle')).toBe('AVAILABILITY ROSTER');
  });

  describe('filtering', () => {
    describe('filer by unit', () => {const unitId = 1;
    let filter: ReactWrapper;

    beforeEach(async () => {
      filter = subject.find(Filter).at(0);
      filter.simulate('change', {target: {value: unitId}});
      await forIt();
      subject.update();
    });

      it('can filter a roster by unit', async () => {
        const filteredRoster = await airmanRepositoryStub.findByUnit(unitId);
        expect(subject.find(Roster).prop('airmen')).toEqual(filteredRoster);
      });

      it('can filter a roster by all units', async () => {
        filter.simulate('change', {target: {value: createDefaultOption('').value}});
        await forIt();
        subject.update();

        expect(subject.find(Roster).prop('airmen')).toEqual(airmen);
      });
    });
  });

  describe('filter by crew', () => {
    const crewId = 1;
    let filter: ReactWrapper;

    beforeEach(async () => {
      filter = subject.find(Filter).at(1);
      filter.simulate('change', {target: {value: crewId}});
      await forIt();
      subject.update();
    });

    it('can filter a roster by crew', async () => {
      const filteredRoster = await airmanRepositoryStub.findByCrew(crewId);
      expect(subject.find(Roster).prop('airmen')).toEqual(filteredRoster);
    });
  });
});
