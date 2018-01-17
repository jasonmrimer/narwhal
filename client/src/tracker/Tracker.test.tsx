import * as React from 'react';
import { mount, ReactWrapper } from 'enzyme';
import AirmanRepositoryStub from '../airman/repositories/doubles/AirmanRepositoryStub';
import Roster from '../roster/Roster';
import { Tracker } from './Tracker';
import { findFilterById, forIt, selectOption } from '../utils/testUtils';
import SquadronRepositoryStub from '../squadron/repositories/doubles/SquadronRepositoryStub';
import SidePanel from './SidePanel/SidePanel';
import AirmanModel from '../airman/models/AirmanModel';
import PlannerServiceStub from './services/doubles/PlannerServiceStub';
import TopBar from '../widgets/TopBar';
import CertificationRepositoryStub from '../airman/repositories/doubles/CertificationRepositoryStub';
import { AirmanStore } from '../airman/AirmanStore';
import { SquadronStore } from '../squadron/SquadronStore';
import { CertificationStore } from '../airman/CertificationStore';
import { FlightStore } from '../flight/FlightStore';
import createDefaultOption from '../utils/createDefaultOption';

const airmanRepositoryStub = new AirmanRepositoryStub();
const certificationRepositoryStub = new CertificationRepositoryStub();
const squadronRepositoryStub = new SquadronRepositoryStub();
const plannerServiceStub = new PlannerServiceStub();
const squadronStore = new SquadronStore(squadronRepositoryStub);
const flightStore = new FlightStore(squadronStore);
const certificationStore = new CertificationStore(certificationRepositoryStub);
const airmanStore = new AirmanStore(airmanRepositoryStub, squadronStore, flightStore, certificationStore);

let subject: ReactWrapper, airmen: AirmanModel[];

describe('Tracker', () => {
  beforeEach(async () => {
    subject = mount(
      <Tracker
        username="Tytus"
        airmanStore={airmanStore}
        certificationStore={certificationStore}
        squadronStore={squadronStore}
        flightStore={flightStore}
        plannerService={plannerServiceStub}
      />
    );
    await forIt();
    subject.update();

    airmen = await airmanRepositoryStub.findAll();
  });

  it('renders a Roster with the current week', async () => {
    expect(subject.find(Roster).prop('week')).toEqual(plannerServiceStub.getCurrentWeek());
  });

  it('renders the TopBar with a username and pageTitle', async () => {
    expect(subject.find(TopBar).prop('username')).toBe('Tytus');
    expect(subject.find(TopBar).prop('pageTitle')).toBe('AVAILABILITY ROSTER');
  });

  describe('the side panelStore', () => {
    it('does not render by default', () => {
      expect(subject.find(SidePanel).exists()).toBeFalsy();
    });

    it('populates the side panelStore with the selected airman', () => {
      subject.find(Roster).find('tbody tr').at(0).simulate('click');

      const sidePanel = subject.find(SidePanel);
      expect(sidePanel.exists()).toBeTruthy();
      expect(sidePanel.text()).toContain(airmen[0].lastName);
      expect(sidePanel.text()).toContain(airmen[0].firstName);
    });

    it('closes the sidepanel', () => {
      subject.find(Roster).find('tbody tr').at(0).simulate('click');
      subject.find(SidePanel).find('button').simulate('click');
      expect(subject.find(SidePanel).exists()).toBeFalsy();
    });

  });

  describe('filtering', () => {
    const defaultFilterValue = createDefaultOption('').value;
    const flightId = 1;
    const squadronId = 1;
    let filter: ReactWrapper;

    describe('by squadron', () => {
      beforeEach(async () => {
        filter = findFilterById(subject, 'squadron-filter');
        await selectOption(subject, filter, squadronId);
      });

      it('limits the flight filter options', () => {
        const selectValue = squadronStore.options[0].value;
        filter.simulate('change', {target: {value: selectValue}});
        const flightOptions = findFilterById(subject, 'flight-filter').find('option');
        expect(flightOptions.length).toBe(2);
      });

      it('shows the airmen for the selected squadron', async () => {
        const filteredRoster = await airmanRepositoryStub.findBySquadron(squadronId);
        expect(subject.find(Roster).find('tbody tr').length).toEqual(filteredRoster.length);
      });

      it('shows all airmen for the default filter', async () => {
        await selectOption(subject, filter, defaultFilterValue);
        expect(subject.find(Roster).find('tbody tr').length).toEqual(airmen.length);
      });
    });

    describe('by flight', () => {
      beforeEach(async () => {
        filter = findFilterById(subject, 'squadron-filter');
        await selectOption(subject, filter, squadronId);

        filter = findFilterById(subject, 'flight-filter');
        await selectOption(subject, filter, flightId);
      });

      it('shows airmen for the selected flight', async () => {
        const filteredRoster = await airmanRepositoryStub.findByFlight(flightId);
        const roster = subject.find(Roster).find('tbody tr');
        expect(roster.length).toBe(filteredRoster.length);
      });

      it('shows all airmen in squadron after reset flight filter to the default filter', async () => {
        await selectOption(subject, filter, defaultFilterValue);
        const filteredRoster = await airmanRepositoryStub.findBySquadron(squadronId);
        expect(subject.find(Roster).find('tbody tr').length).toBe(filteredRoster.length);
      });
    });

    describe('by certification', () => {
      it('shows airmen for the selected certification', async () => {
        certificationStore.setCertificationIds([{value: 1, label: '1'}]);
        subject.update();
        expect(subject.find(Roster).find('tbody tr').length).toBe(4);
      });

      it('shows airmen for many certification selections', () => {
        certificationStore.setCertificationIds([
          {value: 1, label: '1'},
          {value: 2, label: '2'},
        ]);
        subject.update();
        expect(subject.find(Roster).find('tbody tr').length).toBe(2);
      });

      it('shows all airmen for the default filter', async () => {
        certificationStore.setCertificationIds([]);
        subject.update();
        expect(subject.find(Roster).find('tbody tr').length).toBe(airmen.length);
      });
    });
  });
});
