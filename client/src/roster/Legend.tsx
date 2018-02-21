import * as React from 'react';
import { AppointmentIcon } from '../icons/AppointmentIcon';
import { LeaveIcon } from '../icons/LeaveIcon';
import { MissionIcon } from '../icons/MissionIcon';
import { AvailableIcon } from '../icons/AvailableIcon';
import styled from 'styled-components';

interface Props {
  className?: string;
}

export const Legend = (props: Props) => {
  return (
    <div className={props.className}>
      <div>
        <AppointmentIcon/>
        <span>APPOINTMENT</span>
      </div>
      <div>
        <LeaveIcon/>
        <span>LEAVE</span>
      </div>
      <div>
        <MissionIcon/>
        <span>MISSION</span>
      </div>
      <div>
        <AvailableIcon/>
        <span>AVAILABLE</span>
      </div>
    </div>
  );
};

export const StyledLegend = styled(Legend)`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  background: ${props => props.theme.blueSteel};
  margin-top: 2rem;
  padding: 0.5rem;
  border: 1px solid ${props => props.theme.graySteel};

  & > div {
    display: flex;
    margin: 0 0.6rem;
    align-items: center;
    span {
      margin: 0 0.75rem;
    }
  }
`;
