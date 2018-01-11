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
import createDefaultOption from '../utils/createDefaultOption';
import SquadronModelFactory from '../squadron/factories/SquadronModelFactory';
import CertificationRepositoryStub from '../airman/repositories/doubles/CertificationRepositoryStub';

const airmanRepositoryStub = new AirmanRepositoryStub();
const certificationRepositoryStub = new CertificationRepositoryStub();
const squadronRepositoryStub = new SquadronRepositoryStub();
const plannerServiceStub = new PlannerServiceStub();
let subject: ReactWrapper, airmen: AirmanModel[];

describe('Tracker', () => {
  beforeEach(async () => {
    subject = mount(
      <Tracker
        username="Tytus"
        airmanRepository={airmanRepositoryStub}
        certificationRepository={certificationRepositoryStub}
        squadronRepository={squadronRepositoryStub}
        plannerService={plannerServiceStub}
      />
    );
    await forIt();
    subject.update();

    airmen = await airmanRepositoryStub.findAll();
  });

  it('renders a Roster with all squadrons and all flight', async () => {
    expect(subject.find(Roster).prop('airmen')).toEqual(airmen);
  });

  it('renders a Roster with the current week', async () => {
    expect(subject.find(Roster).prop('week')).toEqual(plannerServiceStub.getCurrentWeek());
  });

  it('renders the TopBar with a username and pageTitle', async () => {
    expect(subject.find(TopBar).prop('username')).toBe('Tytus');
    expect(subject.find(TopBar).prop('pageTitle')).toBe('AVAILABILITY ROSTER');
  });

  it('renders a Flight Filter with a default message', () => {
    expect(findFilterById(subject, 'flight-filter').text()).toContain('Select Squadron');
  });

  describe('the side panel', () => {
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
    const flightId = 1;
    const squadronId = 1;
    let filter: ReactWrapper;

    describe('by squadron', () => {
      beforeEach(async () => {
        filter = findFilterById(subject, 'squadron-filter');
        await selectOption(subject, filter, squadronId);
      });

      it('selecting a squadron sets the selectedSquadronId', () => {
        expect(subject.state('selectedSquadronId')).toBe(squadronId);
      });

      it('limits the flight filter options', () => {
        const selectedSquadron = SquadronModelFactory.build(squadronId);
        const flightOptions = selectedSquadron.flights.map((flight) => {
          return {value: flight.id, label: flight.name};
        });
        let flightFilter = findFilterById(subject, 'flight-filter');
        expect(flightFilter.prop('options')).toMatchObject(flightOptions);
      });

      it('shows the airmen for the selected squadron', async () => {
        const filteredRoster = await airmanRepositoryStub.findBySquadron(squadronId);
        expect(subject.find(Roster).prop('airmen')).toEqual(filteredRoster);
      });

      it('shows all airmen for the default filter', async () => {
        await selectOption(subject, filter, defaultFilterValue);
        expect(subject.find(Roster).prop('airmen')).toEqual(airmen);
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
        expect(subject.find(Roster).prop('airmen')).toEqual(filteredRoster);
      });

      it('shows all airmen for the default filter', async () => {
        await selectOption(subject, filter, defaultFilterValue);
        expect(subject.find(Roster).prop('airmen')).toEqual(airmen);
      });
    });

    describe('by certification', () => {
      it('shows airmen for the selected certification', async () => {
        (subject.instance() as Tracker).setSelectedCertificationIds([
          {value: 1, label: '1'}
        ]);
        subject.update();

        expect(subject.find(Roster).prop('airmen').map(a => a.id))
          .toEqual([airmen[0].id, airmen[3].id, airmen[6].id, airmen[9].id]);
      });

      it('shows airmen for many certification selections', () => {
        (subject.instance() as Tracker).setSelectedCertificationIds([
          {value: 1, label: '1'},
          {value: 2, label: '2'},
        ]);
        subject.update();

        expect(subject.find(Roster).prop('airmen').map(a => a.id))
          .toEqual([airmen[3].id, airmen[9].id]);
      });

      it('shows all airmen for the default filter', async () => {
        (subject.instance() as Tracker).setSelectedCertificationIds([]);
        subject.update();
        expect(subject.find(Roster).prop('airmen')).toEqual(airmen);
      });
    });
  });
});
