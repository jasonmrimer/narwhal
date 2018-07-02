import * as React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import * as moment from 'moment';
import { AirmanModelFactory } from '../../airman/factories/AirmanModelFactory';
import { FlightShiftPopup } from './FlightShiftPopup';
import Mock = jest.Mock;
import { ShiftType } from '../../airman/models/AirmanModel';

describe('FlightSchedulePopup', () => {
  let subject: ShallowWrapper;
  let onCancelSpy: Mock;
  const siteManagerActions: any = {
    saveFlightShift: jest.fn()
  };
  const siteManagerStore: any = {
    pendingShift: () =>  ShiftType.Day,
    currentPendingFlightName: () => 'DOA',
    pendingScheduleStartDate: moment(),
    getAirmenByFlightId: () => {
      return AirmanModelFactory.buildList(2);
    }
  };

  beforeEach(() => {
    onCancelSpy = jest.fn();
    subject = shallow(
      <FlightShiftPopup
        onCancel={onCancelSpy}
        siteManagerStore={siteManagerStore}
        siteManagerActions={siteManagerActions}
        count={42}
      />
    );
  });

  it('should render number of affected people', () => {
    expect(subject.find('.flight-count').text()).toBe('This change will affect 42 operators.');
  });
});