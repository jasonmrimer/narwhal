import * as React from 'react';
import { Link } from 'react-router-dom';
import { shallow, ShallowWrapper } from 'enzyme';
import { FlightTableRow, FlightTables } from './FlightTables';
import { FlightModel } from '../flight/model/FlightModel';
import { AirmanModelFactory } from '../airman/factories/AirmanModelFactory';
import { StyledShiftDropdown } from '../tracker/ShiftDropdown';
import { ShiftType } from '../airman/models/AirmanModel';

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
    }
  };
  let siteManagerActions: any;
  let subject: ShallowWrapper;

  beforeEach(() => {
    siteManagerActions = {
      setFlightShift: jest.fn()
    };

    subject = shallow(
      <FlightTables
        flights={flights}
        siteManagerStore={siteManagerStore}
        siteManagerActions={siteManagerActions}
      />
    );
  });

  it('should render a shift dropdown for each flight', () => {
    expect(subject.find(StyledShiftDropdown).length).toBe(flights.length);
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
});