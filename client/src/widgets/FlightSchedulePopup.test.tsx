import * as React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import { FlightSchedulePopup } from './FlightSchedulePopup';
import Mock = jest.Mock;
import { StyledDatePicker } from './inputs/DatePicker';
import * as moment from 'moment';

describe('FlightSchedulePopup', () => {
  let subject: ShallowWrapper;
  let onCancelSpy: Mock;
  const siteManagerActions: any = {
    setPendingScheduleStartDate: jest.fn(),
    saveFlightSchedule: jest.fn()
  };
  const siteManagerStore: any = {
    pendingScheduleStartDate: moment()
  };

  beforeEach(() => {
    onCancelSpy = jest.fn();
    subject = shallow(
      <FlightSchedulePopup
        onCancel={onCancelSpy}
        siteManagerStore={siteManagerStore}
        siteManagerActions={siteManagerActions}
      />
    );
  });

  it('should render a date pick', () => {
    const datePicker = subject.find(StyledDatePicker);
    expect(datePicker.exists()).toBeTruthy();
    datePicker.simulate('change', {target: {value: 'Some Time'}});
    expect(siteManagerActions.setPendingScheduleStartDate).toHaveBeenCalledWith('Some Time');
  });
});