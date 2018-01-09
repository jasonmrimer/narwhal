import * as React from 'react';
import { mount, ReactWrapper } from 'enzyme';
import AirmanRepositoryStub from '../airman/repositories/doubles/AirmanRepositoryStub';
import Roster from '../roster/Roster';
import { Tracker } from './Tracker';
import { findFilterById, forIt, selectOption } from '../utils/testUtils';
import UnitRepositoryStub from '../unit/repositories/doubles/UnitRepositoryStub';
import SidePanel from './SidePanel/SidePanel';
import AirmanModel from '../airman/models/AirmanModel';
import PlannerServiceStub from './services/doubles/PlannerServiceStub';
import TopBar from '../widgets/TopBar';
import FlightRepositoryStub from '../flight/repositories/doubles/FlightRepositoryStub';
import createDefaultOption from '../utils/createDefaultOption';

const airmanRepositoryStub = new AirmanRepositoryStub();
const unitRepositoryStub = new UnitRepositoryStub();
const plannerServiceStub = new PlannerServiceStub();
const flightRepository = new FlightRepositoryStub();
let subject: ReactWrapper, airmen: AirmanModel[];

describe('Tracker', () => {
  beforeEach(async () => {
    subject = mount(
      <Tracker
        username="Tytus"
        airmanRepository={airmanRepositoryStub}
        unitRepository={unitRepositoryStub}
        plannerService={plannerServiceStub}
        flightRepository={flightRepository}
      />
    );
    airmen = await airmanRepositoryStub.findAll();
    await forIt();
    subject.update();
  });

  it('renders a Roster with all units and all flight', async () => {
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

    it('populates the side panel with the selected airman', () => {
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
    const defaultFilterValue = createDefaultOption('').value;
    const unitId = 1;
    const flightId = 1;
    let filter: ReactWrapper;

    describe('by unit', () => {
      beforeEach(async () => {
        filter = findFilterById(subject, 'unit-filter');
        await selectOption(subject, filter, unitId);
      });

      xit('limits the flight filter options', () => {
        // TODO : implement feature
      });

      it('shows the airmen for the selected unit', async () => {
        const filteredRoster = await airmanRepositoryStub.findByUnit(unitId);
        expect(subject.find(Roster).prop('airmen')).toEqual(filteredRoster);
      });

      it('shows all airmen for the default filter', async () => {
        await selectOption(subject, filter, defaultFilterValue);
        expect(subject.find(Roster).prop('airmen')).toEqual(airmen);
      });
    });

    describe('by flight', () => {
      beforeEach(async () => {
        filter = findFilterById(subject, 'flight-filter');
        await selectOption(subject, filter, flightId);
      });

      it('shows airmen for the selected flight', async () => {
        const filteredRoster = await airmanRepositoryStub.findByFlight(flightId);
        expect(subject.find(Roster).prop('airmen')).toEqual(filteredRoster);
      });

      it('shows all airmen for the default filter', async () => {
        await selectOption(subject, filter, defaultFilterValue);
        expect(subject.find(Roster).prop('airmen')).toEqual(airmen);
      });
    });
  });
});

