import * as React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import { FlightTables } from './FlightTables';
import { FlightModel } from '../flight/model/FlightModel';
import { AirmanModelFactory } from '../airman/factories/AirmanModelFactory';
import { ShiftType } from '../airman/models/AirmanModel';
import { StyledFlightSchedulePopup } from '../widgets/popups/FlightSchedulePopup';
import { StyledFlightShiftPopup } from '../widgets/popups/FlightShiftPopup';
import { FlightAirmanSelectionStore } from './stores/FlightAirmanSelectionStore';
import { SiteManagerStore } from './stores/SiteManagerStore';
import { DoubleRepositories } from '../utils/Repositories';
import { makeFakeProfile } from '../utils/testUtils';
import { adminAbility } from '../app/abilities';
import { SquadronModel } from '../squadron/models/SquadronModel';
import { CertificationModelFactory } from '../skills/certification/factories/CertificationModelFactory';
import { ScheduleModel, ScheduleType } from '../schedule/models/ScheduleModel';
import { Link } from 'react-router-dom';
import { StyledFlightTableRow } from './FlightTableRow';
import { StyledSingleTypeahead } from '../widgets/inputs/SingleTypeahead';

describe('FlightTables', () => {
  const flights = [
    new FlightModel(1, 'A', 1),
    new FlightModel(2, 'B', 1),
    new FlightModel(3, 'C', 1)
  ];

  const airman = AirmanModelFactory.build();
  const squadron = new SquadronModel(1, 'squadron', flights);
  const profile = makeFakeProfile('ADMIN', adminAbility);
  const schedules = [new ScheduleModel(1, ScheduleType.BackHalf), new ScheduleModel(2, ScheduleType.FrontHalf)];

  let siteManagerStore: SiteManagerStore;

  let siteManagerActions: any;
  let subject: ShallowWrapper;

  let flightAirmanSelectionStore = new FlightAirmanSelectionStore();

  beforeEach(() => {
    siteManagerStore = new SiteManagerStore(DoubleRepositories);

    siteManagerStore.setPendingOperatorFlightId = jest.fn();

    siteManagerStore.hydrate(
      profile,
      squadron,
      [airman],
      CertificationModelFactory.buildList(3, profile.siteId),
      schedules);

    siteManagerActions = {
      setFlightShift: jest.fn(),
      setFlightSchedule: jest.fn(),
      saveFlightSchedule: jest.fn(),
      expandFlight: jest.fn(),
      saveFlightShift: jest.fn()
    };

    subject = shallow(
      <FlightTables
        flights={flights}
        siteManagerStore={siteManagerStore}
        siteManagerActions={siteManagerActions}
        flightAirmanSelectionStore={flightAirmanSelectionStore}
      />
    );
  });

  it('should render StyledSingleTypeahead for schedules', () => {
    expect(subject.find(StyledSingleTypeahead).length).toBe(0);

    siteManagerStore.addFlightToExpandedFlights(1);
    siteManagerStore.addFlightToExpandedFlights(2);
    siteManagerStore.addFlightToExpandedFlights(3);

    subject.update();

    const scheduleTypeaheads = subject.find(StyledSingleTypeahead);
    expect(scheduleTypeaheads.length).toBe(flights.length);
  });

  it('should shows a header above the list of airmen', () => {
    siteManagerStore.addFlightToExpandedFlights(1);
    subject.update();

    const headers = subject.find('.flight-sub-header');

    expect(headers.at(0).text()).toContain('NAME');
    expect(headers.at(0).text()).toContain('SHIFT');
    expect(headers.at(0).text()).toContain('SCHEDULE');
  });

  it('renders a row for each airman', () => {
    siteManagerStore.addFlightToExpandedFlights(1);
    subject.update();

    expect(subject.find(StyledFlightTableRow).exists()).toBeTruthy();
  });

  it('should setup bindings Flight Schedule Popup', () => {
    siteManagerStore.setSchedulePrompt(1, Number(ScheduleType.FrontHalf));
    subject.update();

    expect(subject.find(StyledFlightSchedulePopup).prop('onCancel'))
      .toBe(siteManagerStore.hideSchedulePrompt);
  });

  it('should setup bindings Flight Shift Popup', () => {
    siteManagerStore.setShiftPrompt(1, ShiftType.Day);
    subject.update();

    expect(subject.find(StyledFlightShiftPopup).prop('onCancel'))
      .toBe(siteManagerStore.hideShiftPrompt);
  });

  it('should render an New Operator link', () => {
    siteManagerStore.addFlightToExpandedFlights(1);
    subject.update();

    expect(subject.find('.new-operator-button').find(Link).prop('to')).toBe('/flights/new');
  });

  it('new operator link should call setPendingOperatorFlightId onClick', () => {
    siteManagerStore.addFlightToExpandedFlights(1);
    subject.update();

    subject.find('.new-operator-button').find(Link).simulate('click');

    expect(siteManagerStore.setPendingOperatorFlightId).toHaveBeenCalledWith(flights[0].id);
  });
});