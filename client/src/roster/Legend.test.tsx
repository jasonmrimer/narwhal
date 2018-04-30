import { AvailableIcon } from '../icons/AvailableIcon';
import { shallow } from 'enzyme';
import { Legend } from './Legend';
import * as React from 'react';
import { AppointmentIcon } from '../icons/AppointmentIcon';
import { MissionIcon } from '../icons/MissionIcon';
import { LeaveIcon } from '../icons/LeaveIcon';
import { TDYDeploymentIcon } from '../icons/TDYDeploymentIcon';
import { OffDayIcon } from '../icons/OffDayIcon';

describe('Legend', () => {
  const subject = shallow(<Legend />);
  it('renders icons and titles', () => {
    expect(subject.text()).toContain('AVAILABLE');
    expect(subject.find(AvailableIcon).exists).toBeTruthy();

    expect(subject.text()).toContain('APPOINTMENT');
    expect(subject.find(AppointmentIcon).exists).toBeTruthy();

    expect(subject.text()).toContain('MISSION');
    expect(subject.find(MissionIcon).exists).toBeTruthy();

    expect(subject.text()).toContain('LEAVE');
    expect(subject.find(LeaveIcon).exists).toBeTruthy();

    expect(subject.text()).toContain('TDY/DEPLOYMENT');
    expect(subject.find(TDYDeploymentIcon).exists).toBeTruthy();

    expect(subject.text()).toContain('OFF DAY');
    expect(subject.find(OffDayIcon).exists).toBeTruthy();
  });
});