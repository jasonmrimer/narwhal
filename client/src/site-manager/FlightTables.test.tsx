import * as React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import { FlightTableRow, FlightTables } from './FlightTables';
import { FlightModel } from '../flight/model/FlightModel';
import { AirmanModelFactory } from '../airman/factories/AirmanModelFactory';
import { StyledShiftDropdown } from '../tracker/ShiftDropdown';
import { ShiftType } from '../airman/models/AirmanModel';
import { StyledDropdown } from '../widgets/inputs/Dropdown';
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
import { Link } from "react-router-dom";

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

  it('should render StyledDropdown for schedules', () => {
    expect(subject.find(StyledDropdown).length).toBe(0);

    siteManagerStore.addFlightToExpandedFlights(1);
    siteManagerStore.addFlightToExpandedFlights(2);
    siteManagerStore.addFlightToExpandedFlights(3);

    subject.update();

    const scheduleDropdowns = subject.find(StyledDropdown);
    expect(scheduleDropdowns.length).toBe(flights.length);
    expect(scheduleDropdowns.at(0).prop('options')).toBe(siteManagerStore.scheduleOptions);
    expect(scheduleDropdowns.at(0).prop('value')).toBe(siteManagerStore.getScheduleIdByFlightId(1));

    scheduleDropdowns.at(0).simulate('change', {target: {value: 2}});
    expect(siteManagerActions.setFlightSchedule).toHaveBeenCalledWith(flights[0].id, 2);
  });

  it('should call setFlightShift when selecting a shift', () => {
    siteManagerStore.addFlightToExpandedFlights(1);
    subject.update();

    const setShift = subject.find(StyledShiftDropdown).at(0).prop('setShift');
    setShift(ShiftType.Night);
    expect(siteManagerActions.setFlightShift)
      .toHaveBeenLastCalledWith(flights[0].id, ShiftType.Night);
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

    expect(subject.find(FlightTableRow).exists()).toBeTruthy();
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
});