import * as React from 'react';
import { Link } from 'react-router-dom';
import { shallow, ShallowWrapper } from 'enzyme';
import { FlightTableRow, FlightTables } from './FlightTables';
import { FlightModel } from '../flight/model/FlightModel';
import { AirmanModelFactory } from '../airman/factories/AirmanModelFactory';
import { StyledShiftDropdown } from '../tracker/ShiftDropdown';
import { ShiftType } from '../airman/models/AirmanModel';
import { StyledDropdown } from '../widgets/inputs/Dropdown';
import { StyledFlightSchedulePopup } from '../widgets/popups/FlightSchedulePopup';
import {StyledFlightShiftPopup} from "../widgets/popups/FlightShiftPopup";

describe('FlightTables', () => {
  const flights = [
    new FlightModel(1, 'A', 1),
    new FlightModel(2, 'B', 1),
    new FlightModel(3, 'C', 1)
  ];
  const airman = AirmanModelFactory.build();
  let siteManagerActions: any;
  let siteManagerStore: any;

  let subject: ShallowWrapper;
  beforeEach(() => {

    siteManagerStore = {
      getAirmenByFlightId: () => {
        return [airman];
      },
      getShiftByFlightId: () => {
        return ShiftType.Day;
      },
      getScheduleIdByFlightId: () => {
        return '1';
      },
      shouldShowSchedulePrompt: () => {
        return true;
      },
      scheduleOptions: [{label: 'Front Half', value: 1}, {label: 'Back Half', value: 2}],
      shouldExpandFlight: () => {
        return true;
      },
      shouldAllowFlightDelete: () => {
        return true;
      },
      pendingFlightShift: () => {return false},
    };

    siteManagerActions = {
      setFlightShift: jest.fn(),
      setFlightSchedule: jest.fn(),
      expandFlight: jest.fn()
    };

    subject = shallow(
      <FlightTables
        flights={flights}
        siteManagerStore={siteManagerStore}
        siteManagerActions={siteManagerActions}
      />
    );
  });

  it('should render StyledDropdown for schedules', () => {
    const scheduleDropdowns = subject.find(StyledDropdown);
    expect(scheduleDropdowns.length).toBe(flights.length);
    expect(scheduleDropdowns.at(0).prop('options')).toBe(siteManagerStore.scheduleOptions);
    expect(scheduleDropdowns.at(0).prop('value')).toBe(siteManagerStore.getScheduleIdByFlightId());
    scheduleDropdowns.at(0).simulate('change', {target: {value: 2}});
    expect(siteManagerActions.setFlightSchedule).toHaveBeenCalledWith(flights[0].id, 2);
  });

  it('should call setFlightShift when selecting a shift', () => {
    const setShift = subject.find(StyledShiftDropdown).at(0).prop('setShift');
    setShift(ShiftType.Night);
    expect(siteManagerActions.setFlightShift)
      .toHaveBeenLastCalledWith(flights[0].id, ShiftType.Night);
  });

  it('should shows a header above the list of airmen', () => {
    const headers = subject.find('.flight-sub-header');
    expect(headers.at(0).text()).toContain('NAME');
    expect(headers.at(0).text()).toContain('SHIFT');
    expect(headers.at(0).text()).toContain('SCHEDULE');
  });

  it('renders a row for each airman', () => {
    expect(subject.find(FlightTableRow).exists()).toBeTruthy();
  });

  it('should render a link to the airmans profile', () => {
    subject = shallow(<FlightTableRow airman={airman}/>);
    const link = subject.find(Link).at(0);
    expect(link.prop('to')).toBe(`/flights/${airman.id}`);
    expect(link.children().at(0).text()).toContain(`${airman.lastName}, ${airman.firstName}`);
  });

  it('should setup bindings Flight Schedule Popup', () => {
    expect(subject.find(StyledFlightSchedulePopup).prop('onCancel'))
      .toBe(siteManagerStore.hideSchedulePrompt);
    expect(subject.find(StyledFlightSchedulePopup).prop('onConfirm'))
      .toBe(siteManagerStore.saveSchedule);
  });

  it('should render a Flight Shift popup when pending shift change', () => {
    Object.assign(siteManagerStore, {pendingFlightShift: () => {return true}});
    subject.update();
    expect(subject.find(StyledFlightShiftPopup).exists()).toBeTruthy();
  });

  it('should not render a Flight Shift popup on load', () => {
    Object.assign(siteManagerStore, {pendingFlightShift: () => {return false}});
    subject.update();
    expect(subject.find(StyledFlightShiftPopup).exists()).toBeFalsy();
  });

});