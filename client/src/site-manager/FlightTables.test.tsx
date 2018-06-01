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

describe('FlightTables', () => {
  const flights = [
    new FlightModel(1, 'A'),
    new FlightModel(2, 'B'),
    new FlightModel(3, 'C')
  ];
  const airman = AirmanModelFactory.build();
  const siteManagerStore: any = {
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
    scheduleOptions: [{label: 'Front Half', value: 1}, {label: 'Back Half', value: 2}]
  };

  let siteManagerActions: any;
  let subject: ShallowWrapper;

  beforeEach(() => {
    siteManagerActions = {
      setFlightShift: jest.fn(),
      setFlightSchedule: jest.fn(),
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
});